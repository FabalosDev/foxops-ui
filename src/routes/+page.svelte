<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import type { PageData } from './$types';

  // --- MODULE IMPORTS ---
  import CommandDeck from '$lib/components/CommandDeck.svelte';
  import LiveFeed from '$lib/components/foxops/LiveFeed.svelte';
  import ArchivePanel from '$lib/components/foxops/ArchivePanel.svelte';
  import SopManager from '$lib/components/foxops/SopManager.svelte';
  import UniversalViewer from '$lib/components/foxops/UniversalViewer.svelte';
  import SupportTickets from '$lib/components/foxops/SupportTickets.svelte';

  // --- ICONS ---
  import {
  Search,
  Zap,
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  BarChart3,
  BookOpen,
  Clock,
  Activity,
  ShieldCheck,
  Target
} from 'lucide-svelte';

  export let data: PageData;
  $: ({ recentReports, stats } = data);

  // Local State for Live Feed
  let activeIncidents: any[] = [];

  // --- STATE ---
  let showSopManager = false;
  let realtimeSubscription: any;

  // Viewer State
  let selectedItem: any = null;
  let viewMode: 'report' | 'log' = 'log';

  // --- HANDLERS ---
  function handleViewLogs(event: CustomEvent) {
    selectedItem = event.detail;
    viewMode = 'log';
  }

  function handleOpenReport(event: CustomEvent) {
    selectedItem = event.detail;
    viewMode = 'report';
  }

  function handleOpenVault() {
    console.log("Vault Requested");
  }

  function toggleSopManager() {
    showSopManager = !showSopManager;
  }

// --- FETCH LOGIC ---
  async function fetchIncidents() {
    // FIX: Idinagdag natin ang '!fk_incidents' para ituro ang specific na relationship
    const { data, error } = await supabase
        .from('incidents')
        .select(`
            *,
            support_tickets!fk_incidents (
                id,
                sop_match_id
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Error fetching incidents:", error);
    } else {
        activeIncidents = (data || []).map(inc => {
            // Check kung array o object (Supabase returns array for 1:Many relationships)
            const ticketData = Array.isArray(inc.support_tickets)
                ? inc.support_tickets[0]
                : inc.support_tickets;

            return {
                ...inc,
                sop_match_id: ticketData?.sop_match_id || null,

                // MAPPING: Kunin ang ID mula sa ticketData na hinila natin
                linked_ticket_id: ticketData?.id || null
            };
        });
        console.log("Incidents Loaded:", activeIncidents.length);
    }
  }
  // --- LIFECYCLE ---
  onMount(async () => {
    // 1. Initial Fetch
    await fetchIncidents();

    // 2. Realtime Listener
    realtimeSubscription = supabase
      .channel('dashboard-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, (payload) => {
          console.log('Real-time update:', payload);
          fetchIncidents();
          invalidateAll();
      })
      .subscribe();
  });

  onDestroy(() => {
    if (realtimeSubscription) supabase.removeChannel(realtimeSubscription);
  });

  // --- KPI CALCULATIONS ---
 $: computedStats = {
    // 1. SIGNAL-TO-NOISE RATIO (SNR)
    snr: activeIncidents.length > 0
      ? Math.round((activeIncidents.filter(i => i.status?.includes('NON_ACTIONABLE')).length / activeIncidents.length) * 100)
      : 0,

    // 2. KNOWLEDGE CAPTURE RATE (KCR)
    kcr: (() => {
      // Filter for actionable items (ignore noise)
      const actionable = activeIncidents.filter(i => !i.status?.includes('NON_ACTIONABLE'));
      if (actionable.length === 0) return 0;

      // Count items that have a draft timestamp (Not null)
      const drafted = actionable.filter(i => i.timestamp_drafted).length;
      return Math.round((drafted / actionable.length) * 100);
    })(),

    // 3. MEAN TIME TO DOCUMENTATION (MTTD)
    avgMttd: (() => {
      // STRICT FILTER: Must have both created_at AND timestamp_drafted
      const documented = activeIncidents.filter(i => i.timestamp_drafted && i.created_at);

      if (documented.length === 0) return "0.0s";

      const totalSeconds = documented.reduce((acc, curr) => {
        const start = new Date(curr.created_at).getTime();
        const end = new Date(curr.timestamp_drafted).getTime();
        // Prevent negative numbers or NaNs
        const diff = (end - start) > 0 ? (end - start) : 0;
        return acc + diff;
      }, 0);

      // Calculate Average
      const avg = totalSeconds / documented.length / 1000;
      return avg.toFixed(1) + 's';
    })(),

    // 4. HEALING ACCURACY (AHA)
    aha: (() => {
      // Only count items where an SOP was actually matched
      const matched = activeIncidents.filter(i => i.sop_match_id);

      if (matched.length === 0) return 100; // Default to 100 if no matches yet

      const healed = matched.filter(i => i.status?.includes('AUTO_HEALED')).length;
      return Math.round((healed / matched.length) * 100);
    })()
};

  // Add a second listener for the reports table
const reportSubscription = supabase
  .channel('reports-feed')
  .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incident_reports' }, () => {
      invalidateAll(); // This will re-run your load function and update recentReports
  })
  .subscribe();
</script>

<div class="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-orange-500/30 p-6 lg:p-12 relative">

  {#if showSopManager}
    <SopManager onClose={() => showSopManager = false} />
  {/if}

  {#if selectedItem}
    <UniversalViewer
        item={selectedItem}
        mode={viewMode}
        on:close={() => selectedItem = null}
    />
  {/if}

  <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8">
    <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
           <Activity size={20} class="text-orange-500" />
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white leading-none">FOXOPS <span class="text-slate-600">DASHBOARD</span></h1>
          <p class="text-slate-500 text-[10px] font-mono tracking-widest uppercase mt-1">Autonomous Remediation Engine v2.1</p>
        </div>
    </div>

    <div class="flex items-center gap-4">
        <button
            on:click={toggleSopManager}
            class="px-4 py-2 bg-blue-600/10 border border-blue-500/30 hover:bg-blue-600/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest rounded flex items-center gap-2 transition-all"
        >
            <BookOpen size={14} /> SOP Matrix
        </button>
    </div>
  </header>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <div class="space-y-6">
        <div class="bg-[#0B1121] border border-white/5 p-6 rounded-2xl group transition-all hover:border-blue-500/30">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Investigating</h3>
             <Search size={18} class="text-slate-600 group-hover:text-blue-400" />
           </div>
           <div class="text-5xl font-bold text-white leading-none">{activeIncidents.filter(i => i.status?.includes('INVESTIGATING')).length}</div>
        </div>

        <div class="bg-[#0B1121] border border-white/5 p-6 rounded-2xl group transition-all hover:border-purple-500/30">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-purple-500/70 text-[10px] font-bold uppercase tracking-widest">Learning Queue</h3>
             <Brain size={18} class="text-purple-500/40 group-hover:text-purple-400" />
           </div>
           <div class="text-5xl font-bold text-white leading-none">{activeIncidents.filter(i => i.status?.includes('LEARNING')).length}</div>
        </div>
    </div>

    <div class="space-y-6">
        <div class="bg-[#0B1121] border border-white/5 p-6 rounded-2xl group transition-all hover:border-emerald-500/30">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-emerald-500/70 text-[10px] font-bold uppercase tracking-widest">Self-Healed</h3>
             <Zap size={18} class="text-emerald-500/40 group-hover:text-emerald-400" />
           </div>
           <div class="text-5xl font-bold text-white leading-none">{activeIncidents.filter(i => i.status?.includes('AUTO_HEALED')).length}</div>
        </div>

        <div class="bg-[#0B1121] border border-blue-500/20 p-6 rounded-2xl group shadow-lg shadow-blue-500/5 transition-all hover:border-blue-400">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-blue-400 text-[10px] font-bold uppercase tracking-widest">Total Resolved</h3>
             <CheckCircle2 size={18} class="text-blue-400/50 group-hover:text-blue-400" />
           </div>
           <div class="text-5xl font-bold text-white">{activeIncidents.filter(i => i.status?.includes('RESOLVED')).length}</div>
        </div>
    </div>

    <div class="space-y-6">
        <div class="bg-[#0B1121] border border-white/5 p-6 rounded-2xl group transition-all hover:border-orange-500/30">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-orange-500/70 text-[10px] font-bold uppercase tracking-widest">Escalated</h3>
             <AlertTriangle size={18} class="text-orange-500/40 group-hover:text-orange-400" />
           </div>
           <div class="text-5xl font-bold text-white leading-none">{activeIncidents.filter(i => i.status?.includes('HUMAN_REQ')).length}</div>
        </div>

        <div class="bg-[#0B1121] border border-red-500/10 p-6 rounded-2xl group transition-all hover:border-red-500/40 shadow-lg shadow-red-500/5">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-red-400/70 text-[10px] font-bold uppercase tracking-widest">Invalid Tickets</h3>
             <XCircle size={18} class="text-red-400/40 group-hover:text-red-400" />
           </div>
           <div class="text-5xl font-bold text-white leading-none">{activeIncidents.filter(i => i.status?.includes('NON_ACTIONABLE')).length}</div>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
    <div class="bg-[#0B1121]/50 border border-white/10 p-5 rounded-2xl flex flex-col gap-2">
        <div class="flex items-center gap-3">
            <BarChart3 size={20} class="text-slate-400" />
            <span class="text-[11px] text-white font-bold uppercase">Signal-to-Noise Ratio</span>
        </div>
        <div class="text-3xl font-bold text-white">{computedStats.snr}%</div>
        <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2 mt-1">
            Logic: (Invalid / Total Tickets)
        </div>
    </div>

    <div class="bg-[#0B1121]/50 border border-white/10 p-5 rounded-2xl flex flex-col gap-2">
        <div class="flex items-center gap-3">
            <Target size={20} class="text-purple-400" />
            <span class="text-[11px] text-white font-bold uppercase">Knowledge Capture</span>
        </div>
        <div class="text-3xl font-bold text-purple-400">{computedStats.kcr}%</div>
        <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2 mt-1">
            Logic: (SOP Drafts / New Incidents)
        </div>
    </div>

    <div class="bg-[#0B1121]/50 border border-white/10 p-5 rounded-2xl flex flex-col gap-2">
        <div class="flex items-center gap-3">
            <Clock size={20} class="text-blue-400" />
            <span class="text-[11px] text-white font-bold uppercase">Doc. Generation Speed</span>
        </div>
        <div class="text-3xl font-bold text-blue-400">~{computedStats.avgMttd}</div>
        <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2 mt-1">
            Logic: (Draft Time - Incident Time)
        </div>
    </div>

    <div class="bg-[#0B1121]/50 border border-white/10 p-5 rounded-2xl flex flex-col gap-2">
        <div class="flex items-center gap-3">
            <ShieldCheck size={20} class="text-emerald-400" />
            <span class="text-[11px] text-white font-bold uppercase">Healing Accuracy</span>
        </div>
        <div class="text-3xl font-bold text-emerald-400">{computedStats.aha}%</div>
        <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2 mt-1">
            Logic: (Auto Fixes / Known SOPs)
        </div>
    </div>
</div>

  <div class="mb-12"><CommandDeck /></div>

  <div class="grid lg:grid-cols-3 gap-6 h-[1000px]">

    <div class="lg:col-span-2 h-full flex flex-col">
        <LiveFeed incidents={activeIncidents} on:viewLogs={handleViewLogs} />
    </div>

    <div class="h-full flex flex-col gap-6">

        <div class="flex-1 min-h-0">
            <SupportTickets />
        </div>

        <div class="flex-1 min-h-0">
            <ArchivePanel
                reports={recentReports}
                on:openReport={handleOpenReport}
                on:openVault={handleOpenVault}
            />
        </div>

    </div>

  </div>

</div>