<script lang="ts">
  import { createEventDispatcher, onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { Activity, CheckCircle2, ShieldAlert, UserCheck, Send, Loader2, BookOpen, User, FileText, ArrowLeft, ArrowRight } from 'lucide-svelte';

  const dispatch = createEventDispatcher();

  // --- STATE ---
  let incidents: any[] = [];
  let page = 0;
  let loading = false;
  let hasMore = true;

  // ARCHITECT FIX: Reduced from 10 to 7 to fit dashboard viewports better
  const PAGE_SIZE = 7;

  // --- RESOLUTION MODAL STATE ---
  let resolvingId: string | null = null;
  let resolvingTicketId: string | null = null;
  let resolutionNotes = "";
  let isReporting = false;

  // SOP State
  let availableSops: any[] = [];
  let selectedSop = "none";
  let newSopTitle = "";
  let newSopContent = "";
  let technicianName = "Senior Systems Architect";

  // --- 1. FETCH & SORT LOGIC ---
  async function fetchIncidents(pageIndex: number) {
    loading = true;
    const from = pageIndex * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    // A. FETCH RAW DATA
    const { data, error } = await supabase
      .from('incidents')
      .select('*')
      .range(from, to)
      .order('created_at', { ascending: false });

    if (!error && data) {
      // B. CLIENT-SIDE SORTING
      incidents = data.sort((a, b) => {
        // 1. Status Rank: Open > Resolved
        const isResolvedA = a.status?.includes('RESOLVED') || a.status?.includes('MANUAL_OVERRIDE');
        const isResolvedB = b.status?.includes('RESOLVED') || b.status?.includes('MANUAL_OVERRIDE');

        if (!isResolvedA && isResolvedB) return -1;
        if (isResolvedA && !isResolvedB) return 1;

        // 2. Priority Rank
        const score = (p: string) => {
          if (!p) return 10;
          if (p.includes('CRITICAL')) return 0;
          if (p.includes('HIGH')) return 1;
          if (p.includes('MEDIUM')) return 2;
          return 3;
        };
        return score(a.priority) - score(b.priority);
      });

      hasMore = data.length === PAGE_SIZE;
    }

    loading = false;
  }

  function nextPage() {
    if (!hasMore) return;
    page++;
    fetchIncidents(page);
  }

  function prevPage() {
    if (page === 0) return;
    page--;
    hasMore = true;
    fetchIncidents(page);
  }

  onMount(() => {
    fetchIncidents(0);

    const subscription = supabase
      .channel('live_incidents')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'incidents' }, (payload) => {
        if (page === 0) {
           incidents = [payload.new, ...incidents].slice(0, PAGE_SIZE);
        }
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'incidents' }, (payload) => {
         incidents = incidents.map(i => i.id === payload.new.id ? payload.new : i);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  });

  // --- 2. HELPERS ---
  function getStatusColor(status: string) {
    if (!status) return 'text-slate-500';
    if (status.includes('MANUAL_OVERRIDE')) return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    if (status.includes('RESOLVED') || status.includes('HEALED')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (status.includes('CRITICAL') || status.includes('ESCALATED')) return 'text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  }

  function formatStatus(status: string) {
    if (!status) return 'UNKNOWN';
    if (status.includes('MANUAL_OVERRIDE')) return 'MANUAL OVERRIDE';
    return status.replace('⚡', '').replace('✅', '').split(':')[0].trim();
  }

  // --- 3. HTML GENERATOR ---
  function generateHtmlReport(data: any) {
    // ... (Keep existing HTML generator logic as is) ...
    // Just returning a simple string here to save space in this response block,
    // BUT IN YOUR CODE, KEEP THE FULL FUNCTION I GAVE EARLIER.
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    return ``;
  }

  // --- 4. ACTIONS ---
  async function fetchSops() {
      const { data } = await supabase.from('sops').select('id, name, workflow_description').order('name');
      if (data) availableSops = data;
  }

  function openResolveModal(id: string) {
      resolvingId = id;
      const incident = incidents.find(i => i.id === id);
      resolvingTicketId = incident?.linked_ticket_id || null;
      newSopTitle = "";
      newSopContent = "";
      resolutionNotes = "";

      const aiSuggestedId = incident?.sop_match_id;
      const isSopAvailable = availableSops.some(s => s.id === aiSuggestedId);
      selectedSop = (aiSuggestedId && isSopAvailable) ? aiSuggestedId : "none";

      fetchSops();
  }

  async function resolveIncident(id: string) {
    const updatePayload: any = { status: '✅ RESOLVED: MANUAL_OVERRIDE', priority: 'LOW' };
    if (selectedSop !== 'none' && selectedSop !== 'new') updatePayload.resolved_by_sop_id = selectedSop;
    incidents = incidents.map(i => i.id === id ? { ...i, ...updatePayload } : i);
    await supabase.from('incidents').update(updatePayload).eq('id', id);
  }

  async function triggerFinalReport(incident: any) {
    if (!incident) return;
    isReporting = true;
    const reportWebhook = "https://hook.eu2.make.com/mmqk3qu5dg2eyc1zvjsb6vnuq84kv5g7";

    // ... (Keep existing report logic) ...

    // For brevity in this fix block, assume logic is same as before.
    // Just simulating success:
    setTimeout(async () => {
        await resolveIncident(incident.id);
        resolvingId = null;
        isReporting = false;
    }, 1000);
  }
</script>

<div class="bg-[#0B1121] border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full min-h-0">

  <div class="p-3 border-b border-white/5 flex justify-between items-center bg-[#080c17]">
     <div class="flex items-center gap-2">
         <Activity size={14} class="text-orange-500" />
         <h2 class="text-xs font-bold text-white uppercase tracking-widest">
           Live Feed <span class="text-slate-500 text-[9px] ml-1">(Page {page + 1})</span>
         </h2>
     </div>

     <div class="flex items-center gap-2">
        <div class="flex items-center gap-1">
          <button on:click={prevPage} disabled={page === 0 || loading} class="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white transition-all">
            <ArrowLeft size={12} />
          </button>
          <button on:click={nextPage} disabled={!hasMore || loading} class="p-1 rounded hover:bg-white/10 disabled:opacity-30 text-slate-400 hover:text-white transition-all">
            <ArrowRight size={12} />
          </button>
        </div>
        <div class="h-3 w-[1px] bg-white/10 mx-1"></div>
        <div class="flex items-center gap-2">
           <span class="relative flex h-1.5 w-1.5">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
           </span>
           <span class="text-[9px] font-mono text-slate-500">{loading ? 'SYNC...' : 'LIVE'}</span>
        </div>
     </div>
  </div>

  <div class="overflow-x-auto overflow-y-auto flex-1 w-full pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-white/5 border-b border-white/5 text-[9px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 backdrop-blur-sm z-10">
          <th class="p-3">Time</th>
          <th class="p-3">Incident</th>
          <th class="p-3">Status</th>
          <th class="p-3 text-right">Control</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5 text-xs">
        {#if loading}
           <tr>
             <td colspan="4" class="p-8 text-center text-orange-500">
               <Loader2 size={20} class="animate-spin mx-auto mb-2" />
               <span class="text-[10px] font-mono">Fetching Telemetry...</span>
             </td>
           </tr>
        {:else if incidents.length === 0}
            <tr>
                <td colspan="4" class="p-8 text-center">
                    <div class="flex flex-col items-center gap-2 text-slate-600">
                        <CheckCircle2 size={24} class="opacity-20" />
                        <span class="text-[10px] font-mono">No incidents found.</span>
                    </div>
                </td>
            </tr>
        {:else}
            {#each incidents as incident (incident.id)}
            <tr class="hover:bg-white/5 transition-colors group">
                <td class="p-2.5 font-mono text-[10px] text-slate-500 whitespace-nowrap">
                  {new Date(incident.created_at || incident.generated_at).toLocaleTimeString()}
                </td>
                <td class="p-2.5">
                  <div class="font-medium text-slate-200 text-xs truncate max-w-[200px]">{incident.title}</div>
                  <div class="text-[9px] text-slate-600 font-mono">ID: {incident.id?.slice(0, 8)}</div>
                </td>
                <td class="p-2.5">
                  <span class={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase tracking-wide ${getStatusColor(incident.status)}`}>
                      {formatStatus(incident.status)}
                  </span>
                </td>
                <td class="p-2.5 text-right flex justify-end gap-2 items-center">
                  <button on:click={() => dispatch('viewLogs', incident)} class="text-[10px] text-slate-500 hover:text-white underline decoration-slate-700 underline-offset-4">
                      Logs
                  </button>

                  {#if incident.status && (incident.status.includes('CRITICAL') || incident.status.includes('ESCALATED') || incident.status.includes('HIGH'))}
                      <button
                      on:click={() => openResolveModal(incident.id)}
                      class="px-2 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/50 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1"
                      >
                      <ShieldAlert size={10} /> Resolve
                      </button>
                  {:else if incident.status && incident.status.includes('MANUAL_OVERRIDE')}
                      <div class="flex items-center gap-1 text-[9px] text-purple-400 font-bold uppercase tracking-wider">
                          <UserCheck size={10} /> Fixed
                      </div>
                  {:else if incident.status && incident.status.includes('RESOLVED')}
                      <div class="flex items-center gap-1 text-[9px] text-emerald-400 font-bold uppercase tracking-wider">
                          <CheckCircle2 size={10} /> Done
                      </div>
                  {/if}
                </td>
            </tr>
            {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

{#if resolvingId}
<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
  <div class="bg-[#0B1121] border border-white/10 w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto pb-32">
     <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 size={16} class="text-emerald-500" /> Finalize Resolution
        </h3>
        <button on:click={() => resolvingId = null} class="text-slate-500 hover:text-white text-xs">CLOSE</button>
    </div>
    <div class="mb-4">
        <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
            <User size={12} /> Resolved By
        </label>
        <input bind:value={technicianName} type="text" class="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:border-emerald-500/50 outline-none font-bold"/>
    </div>
    <div class="flex justify-end gap-3 mt-4">
      <button on:click={() => resolvingId = null} class="px-4 py-2 text-xs text-slate-500 hover:text-white uppercase font-bold">Cancel</button>
      <button on:click={() => triggerFinalReport(incidents.find(i => i.id === resolvingId))} disabled={!resolutionNotes || isReporting} class="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase rounded flex items-center gap-2 disabled:opacity-50 transition-all">
        {#if isReporting}<Loader2 size={14} class="animate-spin" /> Processing...{:else}<Send size={14} /> Submit{/if}
      </button>
    </div>
  </div>
</div>
{/if}