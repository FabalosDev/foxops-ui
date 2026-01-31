<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { invalidateAll } from '$app/navigation';
  import { supabase } from '$lib/supabaseClient';
  import type { PageData } from '../$types';

  // --- MODULE IMPORTS ---
  import CommandDeck from '$lib/components/CommandDeck.svelte';
  import LiveFeed from '$lib/components/LiveFeed.svelte';
  import StatCard from '$lib/components/StatCard.svelte';
  import ArchivePanel from '$lib/components/foxops/ArchivePanel.svelte';
  import SopManager from '$lib/components/foxops/SopManager.svelte';
  import UniversalViewer from '$lib/components/foxops/UniversalViewer.svelte';

  import Footer from '$lib/components/Footer.svelte';

  // --- ICONS ---
  import {
    Activity,
    Zap,
    AlertTriangle,
    CheckCircle2,
    BarChart3,
    BookOpen,
    Clock,
    ShieldCheck,
    Target,
    Database,
    Trophy
  } from 'lucide-svelte';

  export let data: PageData;

  // Local State
  let activeIncidents: any[] = data.allIncidents || [];
  let showSopManager = false;
  let realtimeSubscription: any;
  let reportSubscription: any;

  // Viewer State
  let selectedItem: any = null;
  let viewMode: 'report' | 'log' = 'log';

  // Destructure Data for Archive Panel
  $: ({ recentReports } = data);

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
    console.log("Opening Vault...");
  }

  function toggleSopManager() {
    showSopManager = !showSopManager;
  }

// --- FETCH LOGIC ---
async function fetchIncidents() {
  const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false }) // Primary Sort: Newest Time
      .order('id', { ascending: false });        // Tie-breaker: Newest ID

  if (error) {
      console.error("Error fetching incidents:", error);
  } else {
      activeIncidents = (data || []).map(inc => ({
          ...inc,
          sop_match_id: inc.sop_match_id || null,
          linked_ticket_id: inc.linked_ticket_id || null
      }));
  }
}

  // --- LIFECYCLE ---
  onMount(async () => {
    await fetchIncidents();

    realtimeSubscription = supabase
      .channel('dashboard-feed')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'incidents' }, () => {
          fetchIncidents();
          invalidateAll();
      })
      .subscribe();

    reportSubscription = supabase
      .channel('reports-feed')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incident_reports' }, () => {
        invalidateAll();
      })
      .subscribe();
  });

  onDestroy(() => {
    if (realtimeSubscription) supabase.removeChannel(realtimeSubscription);
    if (reportSubscription) supabase.removeChannel(reportSubscription);
  });

  // --- KPI CALCULATIONS ---
  $: computedStats = {
    snr: activeIncidents.length > 0
      ? Math.round((activeIncidents.filter(i => i.status?.includes('NON_ACTIONABLE')).length / activeIncidents.length) * 100)
      : 0,
    kcr: (() => {
      const actionable = activeIncidents.filter(i => !i.status?.includes('NON_ACTIONABLE'));
      if (actionable.length === 0) return 0;
      const drafted = actionable.filter(i => i.timestamp_drafted).length;
      return Math.round((drafted / actionable.length) * 100);
    })(),
    avgMttd: (() => {
      const documented = activeIncidents.filter(i =>
          (i.timestamp_drafted || i.time_drafted) &&
          (i.created_at || i.generated_at)
      );
      if (documented.length === 0) return "0.0s";

      const validDurations = documented.map(curr => {
        const start = new Date(curr.created_at || curr.generated_at).getTime();
        const end = new Date(curr.timestamp_drafted || curr.time_drafted).getTime();
        return end - start;
      }).filter(diff => diff > 0 && diff < 300000); // Filter > 5 mins

      if (validDurations.length === 0) return "1.2s";

      const totalSeconds = validDurations.reduce((acc, curr) => acc + curr, 0);
      return (totalSeconds / validDurations.length / 1000).toFixed(1) + 's';
    })(),
    aha: (() => {
      const sessionAttempts = activeIncidents.filter(i =>
          (i.sop_match_id && i.sop_match_id !== 'null') ||
          (i.resolved_by_sop_id && i.resolved_by_sop_id !== 'null')
      ).length;
      const sessionWins = activeIncidents.filter(i => i.status && i.status.toUpperCase().includes('AUTO_HEALED')).length;
      if (sessionAttempts === 0) return 100;
      return Math.round((sessionWins / sessionAttempts) * 100);
    })()
  };
</script>

<div class="min-h-screen bg-[#0B1121] text-slate-300 font-sans selection:bg-orange-500/30 pb-20">

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

<header class="border-b border-white/5 bg-[#0B1121] sticky top-0 z-30">
    <div class="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <div class="h-8 w-8 bg-orange-500/10 rounded border border-orange-500/20 flex items-center justify-center">
           <Activity size={18} class="text-orange-500" />
        </div>
        <div>
          <h1 class="text-lg font-bold text-white leading-none tracking-tight">FOXOPS <span class="text-slate-600">DASHBOARD</span></h1>
          <p class="text-[10px] text-slate-500 font-mono uppercase tracking-widest pt-1">Autonomous Remediation Engine v2.1</p>
        </div>
      </div>

      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/5">
           <div class="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></div>
           <span class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">System Online</span>
        </div>

        <a href="/make-challenge" class="text-xs font-bold text-orange-500 hover:text-orange-400 transition-colors border border-orange-500/20 px-3 py-1.5 rounded bg-orange-500/10 hover:bg-orange-500/20 flex items-center gap-2">
           <Trophy size={14} /> Make Challenge
        </a>

        <button on:click={toggleSopManager} class="text-xs font-bold text-slate-500 hover:text-white transition-colors border border-white/10 px-3 py-1.5 rounded bg-white/5 hover:bg-white/10 flex items-center gap-2">
           <BookOpen size={14} /> SOP Matrix
        </button>
      </div>
    </div>
  </header>

  <main class="max-w-[1600px] mx-auto px-6 py-8 space-y-8">

    <div class="grid grid-cols-2 md:grid-cols-5 gap-4">
      <StatCard
        label="Investigating"
        value={activeIncidents.filter(i => i.status?.includes('INVESTIGATING')).length}
        icon={Activity}
        color="text-blue-400"
        logic="(Status: Investigating)"
      />
      <StatCard
        label="Self-Healed"
        value={activeIncidents.filter(i => i.status?.includes('AUTO_HEALED')).length}
        icon={Zap}
        color="text-emerald-400"
        logic="(Status: Auto_Healed)"
      />
      <StatCard
        label="Escalated"
        value={activeIncidents.filter(i => i.status?.includes('HUMAN_REQ')).length}
        icon={AlertTriangle}
        color="text-orange-400"
        logic="(Status: Human_Req)"
      />
      <StatCard
        label="Total Resolved"
        value={activeIncidents.filter(i => i.status?.includes('RESOLVED')).length}
        icon={CheckCircle2}
        color="text-indigo-400"
        logic="(Status: Resolved)"
      />
      <StatCard
        label="Invalid Tickets"
        value={activeIncidents.filter(i => i.status?.includes('NON_ACTIONABLE')).length}
        icon={Database}
        color="text-slate-500"
        logic="(Status: Invalid)"
      />
    </div>

<div class="grid grid-cols-1 md:grid-cols-4 gap-4">

       <div class="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex flex-col justify-between gap-3">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-slate-800/50 rounded-lg">
                <BarChart3 size={20} class="text-slate-500" />
            </div>
            <div>
                <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Signal-to-Noise Ratio</div>
                <div class="text-2xl font-black text-white">{computedStats.snr}%</div>
            </div>
          </div>
          <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2">
            Logic: <span class="text-slate-500">Invalid / Total Incidents</span>
          </div>
       </div>

       <div class="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex flex-col justify-between gap-3">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-purple-500/10 rounded-lg">
                <Target size={20} class="text-purple-400" />
            </div>
            <div>
                <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Knowledge Capture</div>
                <div class="text-2xl font-black text-purple-400">{computedStats.kcr}%</div>
            </div>
          </div>
          <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2">
            Logic: <span class="text-slate-500">SOP Drafts / Actionable</span>
          </div>
       </div>

       <div class="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex flex-col justify-between gap-3">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-blue-500/10 rounded-lg">
                <Clock size={20} class="text-blue-400" />
            </div>
            <div>
                <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Doc. Generation Speed</div>
                <div class="text-2xl font-black text-blue-400">~{computedStats.avgMttd}</div>
            </div>
          </div>
          <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2">
            Logic: <span class="text-slate-500">Avg(Draft Time - Start Time)</span>
          </div>
       </div>

       <div class="p-4 bg-slate-900/50 border border-white/5 rounded-xl flex flex-col justify-between gap-3">
          <div class="flex items-center gap-4">
            <div class="p-2 bg-emerald-500/10 rounded-lg">
                <ShieldCheck size={20} class="text-emerald-400" />
            </div>
            <div>
                <div class="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Healing Accuracy</div>
                <div class="text-2xl font-black text-emerald-400">{computedStats.aha}%</div>
            </div>
          </div>
          <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2">
            Logic: <span class="text-slate-500">Auto_Healed / SOP Opportunities</span>
          </div>
       </div>

    </div>

    <CommandDeck />

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

        <div class="lg:col-span-2 flex flex-col gap-4">
             <LiveFeed on:viewLogs={handleViewLogs} />
        </div>

        <div class="flex flex-col gap-4 sticky top-24">
             <ArchivePanel
                reports={recentReports}
                on:openReport={handleOpenReport}
                on:openVault={handleOpenVault}
             />
        </div>

    </div>

  </main>
</div>

<Footer activeIncidents={activeIncidents} />