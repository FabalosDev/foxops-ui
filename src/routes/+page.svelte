<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import CommandDeck from '$lib/components/CommandDeck.svelte';
  import {
    Activity,
    CheckCircle2,
    AlertTriangle,
    Server,
    Clock,
    FileText,
    Archive,
    Search
  } from 'lucide-svelte';

  // --- TYPE DEFINITIONS ---
  type Incident = {
    id: string;
    title: string;
    status: string;
    priority: string;
    generated_at: string;
    sop_title?: string;
  };

  type Report = {
    id: string;
    sop_used: string;
    archived_at: string;
    tenant_id: string;
  };

  // --- STATE ---
  let stats = {
    active: 0,
    healed: 0,
    learning: 0,
    critical: 0
  };

  let activeIncidents: Incident[] = [];
  let recentReports: Report[] = [];
  let systemStatus = "OPERATIONAL";
  let realtimeChannel: any;

  // --- INITIAL LOAD & REALTIME SUBSCRIPTION ---
  onMount(async () => {
    await fetchDashboardData();

    // Realtime Listener for 'incidents' table
    realtimeChannel = supabase
      .channel('dashboard-feed')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'incidents' },
        (payload) => {
          console.log('Realtime Update:', payload);
          fetchDashboardData(); // Refetch stats on any change
        }
      )
      .subscribe();
  });

  onDestroy(() => {
    if (realtimeChannel) supabase.removeChannel(realtimeChannel);
  });

  // --- DATA FETCHING LOGIC ---
  async function fetchDashboardData() {
    // 1. Get Active Incidents (Raw Feed)
    const { data: incidents } = await supabase
      .from('incidents')
      .select('*')
      .order('generated_at', { ascending: false })
      .limit(5);

    if (incidents) activeIncidents = incidents;

    // 2. Get Recent Forensic Reports (Archive)
    const { data: reports } = await supabase
      .from('incident_reports')
      .select('*')
      .order('archived_at', { ascending: false })
      .limit(5);

    if (reports) recentReports = reports;

    // 3. Calculate Stats (Counters)
    const { data: allIncidents } = await supabase
      .from('incidents')
      .select('status');

    if (allIncidents) {
      stats.active = allIncidents.filter(i => i.status.includes('ACTIVE') || i.status.includes('ANALYZING')).length;
      stats.healed = allIncidents.filter(i => i.status.includes('RESOLVED') || i.status.includes('HEALED')).length;
      stats.learning = allIncidents.filter(i => i.status.includes('LEARNING') || i.status.includes('DRAFT')).length;
      stats.critical = allIncidents.filter(i => i.status.includes('ESCALATED') || i.status.includes('CRITICAL')).length;
    }
  }

  // --- HELPER: Status Color Mapper (Updated for Dark Mode) ---
  function getStatusColor(status: string) {
    if (status.includes('RESOLVED') || status.includes('HEALED')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (status.includes('ACTIVE') || status.includes('ANALYZING')) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    if (status.includes('LEARNING') || status.includes('DRAFT')) return 'text-blue-400 border-blue-500/30 bg-blue-500/10';
    return 'text-rose-400 border-rose-500/30 bg-rose-500/10';
  }
</script>

<div class="min-h-screen bg-[#050505] text-slate-300 font-sans selection:bg-orange-500/30 p-6 lg:p-12">

  <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-white/5 pb-8">
    <div>
      <div class="flex items-center gap-3 mb-2">
        <div class="h-10 w-10 rounded bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
           <Activity size={20} class="text-orange-500" />
        </div>
        <div>
          <h1 class="text-2xl font-bold tracking-tight text-white leading-none">FOXOPS <span class="text-slate-600">DASHBOARD</span></h1>
          <p class="text-slate-500 text-[10px] font-mono tracking-widest uppercase mt-1">Autonomous Remediation Engine v2.1</p>
        </div>
      </div>
    </div>

    <div class="mt-6 md:mt-0 flex items-center gap-8">
      <div class="text-right">
        <div class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">System Heartbeat</div>
        <div class="flex items-center justify-end gap-2 text-emerald-400 font-bold tracking-wider text-sm font-mono">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          {systemStatus}
        </div>
      </div>
    </div>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">

    <div class="bg-[#0B1121] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-white/10 transition-colors">
      <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Activity size={64} />
      </div>
      <h3 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Active Incidents</h3>
      <div class="text-4xl font-bold text-white mb-2">{stats.active}</div>
      <div class="text-xs text-amber-500 flex items-center gap-2 font-mono">
        <span class="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span> Processing
      </div>
    </div>

    <div class="bg-[#0B1121] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-white/10 transition-colors">
      <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <CheckCircle2 size={64} />
      </div>
      <h3 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Self-Healed</h3>
      <div class="text-4xl font-bold text-white mb-2">{stats.healed}</div>
      <div class="text-xs text-emerald-500 font-mono">Autonomous Cycles</div>
    </div>

    <div class="bg-[#0B1121] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-white/10 transition-colors">
      <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <Server size={64} />
      </div>
      <h3 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Learning Queue</h3>
      <div class="text-4xl font-bold text-white mb-2">{stats.learning}</div>
      <div class="text-xs text-blue-500 font-mono">SOP Drafts Pending</div>
    </div>

    <div class="bg-[#0B1121] border border-white/5 p-6 rounded-xl relative overflow-hidden group hover:border-white/10 transition-colors">
      <div class="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
        <AlertTriangle size={64} />
      </div>
      <h3 class="text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-2">Escalated</h3>
      <div class="text-4xl font-bold text-white mb-2">{stats.critical}</div>
      <div class="text-xs text-rose-500 font-mono">Human Intervention</div>
    </div>

  </div>

  <div class="mb-12">
    <CommandDeck />
  </div>

  <div class="grid lg:grid-cols-3 gap-8">

    <div class="lg:col-span-2 space-y-6">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Activity size={16} class="text-orange-500" /> Live Feed
        </h2>
        <span class="text-[10px] font-mono text-slate-500 animate-pulse">RECEIVING TELEMETRY...</span>
      </div>

      <div class="bg-[#0B1121] border border-white/5 rounded-xl overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                <th class="p-4">Time</th>
                <th class="p-4">Incident Title</th>
                <th class="p-4">Status</th>
                <th class="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-white/5 text-sm">
              {#each activeIncidents as incident}
                <tr class="hover:bg-white/5 transition-colors group">
                  <td class="p-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                    {new Date(incident.generated_at).toLocaleTimeString()}
                  </td>
                  <td class="p-4">
                    <div class="font-medium text-slate-200">{incident.title}</div>
                    <div class="text-[10px] text-slate-600 font-mono mt-1 group-hover:text-blue-400 transition-colors">
                      ID: {incident.id.slice(0, 8)}
                    </div>
                  </td>
                  <td class="p-4">
                    <span class={`inline-flex px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(incident.status)}`}>
                      {incident.status.replace('⚡', '').replace('✅', '').split(':')[0]}
                    </span>
                  </td>
                  <td class="p-4 text-right">
                    <button class="text-xs text-slate-500 hover:text-white hover:underline decoration-slate-700 underline-offset-4 transition-all">
                      View Logs
                    </button>
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="4" class="p-12 text-center">
                    <div class="flex flex-col items-center gap-3 text-slate-600">
                      <CheckCircle2 size={32} class="opacity-20" />
                      <span class="text-xs font-mono">No active incidents. The floor is quiet.</span>
                    </div>
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="flex items-center justify-between px-1">
        <h2 class="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <Archive size={16} class="text-blue-500" /> Archive
        </h2>
        <span class="text-[10px] font-mono text-slate-500">LAST 24H</span>
      </div>

      <div class="bg-[#0B1121] border border-white/5 rounded-xl p-1 shadow-inner h-full flex flex-col">
        <ul class="space-y-1 flex-1">
          {#each recentReports as report}
            <li>
              <button class="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group flex items-start gap-3">
                <div class="mt-0.5 p-1.5 bg-slate-800 rounded text-slate-400 group-hover:text-white group-hover:bg-blue-500 transition-all">
                  <FileText size={14} />
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-bold text-slate-300 truncate group-hover:text-white">{report.sop_used || 'Unknown SOP'}</p>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] font-mono text-slate-600 flex items-center gap-1">
                      <Clock size={8}/> {new Date(report.archived_at).toLocaleTimeString()}
                    </span>
                    <span class="text-slate-700">•</span>
                    <span class="text-[10px] text-emerald-500 flex items-center gap-1">
                       Verified
                    </span>
                  </div>
                </div>
              </button>
            </li>
          {:else}
             <li class="p-8 text-center text-slate-600 text-xs font-mono">
               Archive is empty.
             </li>
          {/each}
        </ul>

        <div class="p-3 mt-auto border-t border-white/5">
          <button class="w-full py-2 border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2">
            <Search size={12} /> Open Vault
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="w-full h-12 lg:h-24 pointer-events-none"></div>
</div>
