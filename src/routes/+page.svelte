<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { supabase } from '$lib/supabaseClient';

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
    // Note: In production, use supabase .count() queries for speed.
    // This is a simplified client-side count for the demo.
    const { data: allIncidents } = await supabase
      .from('incidents')
      .select('status');

    if (allIncidents) {
      stats.active = allIncidents.filter(i => i.status.includes('ACTIVE') || i.status.includes('ANALYZING')).length;
      stats.healed = allIncidents.filter(i => i.status.includes('RESOLVED')).length; // Or query reports table count
      stats.learning = allIncidents.filter(i => i.status.includes('LEARNING') || i.status.includes('DRAFT')).length;
      stats.critical = allIncidents.filter(i => i.status.includes('ESCALATED') || i.status.includes('CRITICAL')).length;
    }
  }

  // --- HELPER: Status Color Mapper ---
  function getStatusColor(status: string) {
    if (status.includes('RESOLVED') || status.includes('HEALED')) return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
    if (status.includes('ACTIVE') || status.includes('ANALYZING')) return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    if (status.includes('LEARNING') || status.includes('DRAFT')) return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
    return 'text-rose-400 bg-rose-400/10 border-rose-400/20';
  }
</script>

<div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-slate-900 p-6 lg:p-12">

  <header class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 border-b border-slate-800 pb-6">
    <div>
      <div class="flex items-center gap-3 mb-2">
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
        </span>
        <h1 class="text-3xl font-bold tracking-tight text-white">FOXOPS <span class="text-slate-600">// SENTINEL</span></h1>
      </div>
      <p class="text-slate-400 text-sm font-mono">AUTONOMOUS REMEDIATION ENGINE v1.0</p>
    </div>

    <div class="mt-4 md:mt-0 flex gap-4">
      <div class="text-right">
        <div class="text-xs text-slate-500 font-mono">SYSTEM STATUS</div>
        <div class="text-emerald-400 font-bold tracking-widest">{systemStatus}</div>
      </div>
    </div>
  </header>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
    <div class="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-lg relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg class="w-16 h-16 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/></svg>
      </div>
      <h3 class="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1">Active Incidents</h3>
      <div class="text-4xl font-bold text-white">{stats.active}</div>
      <div class="mt-2 text-xs text-amber-500 flex items-center gap-1">
        <span class="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span> Processing
      </div>
    </div>

    <div class="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-lg relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg class="w-16 h-16 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>
      </div>
      <h3 class="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1">Self-Healed</h3>
      <div class="text-4xl font-bold text-white">{stats.healed}</div>
      <div class="mt-2 text-xs text-emerald-500">Autonomous Cycles</div>
    </div>

    <div class="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-lg relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg class="w-16 h-16 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/></svg>
      </div>
      <h3 class="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1">Learning Queue</h3>
      <div class="text-4xl font-bold text-white">{stats.learning}</div>
      <div class="mt-2 text-xs text-blue-500">SOP Drafts Pending</div>
    </div>

    <div class="bg-slate-900 border border-slate-800 p-6 rounded-lg shadow-lg relative overflow-hidden group">
      <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
        <svg class="w-16 h-16 text-rose-500" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>
      </div>
      <h3 class="text-slate-500 text-xs font-mono uppercase tracking-widest mb-1">Escalated</h3>
      <div class="text-4xl font-bold text-white">{stats.critical}</div>
      <div class="mt-2 text-xs text-rose-500">Human Intervention</div>
    </div>
  </div>

  <div class="grid lg:grid-cols-3 gap-8">

    <div class="lg:col-span-2 space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white flex items-center gap-2">

          LIVE INCIDENTS
        </h2>
        <span class="text-xs font-mono text-slate-500 animate-pulse">RECEIVING TELEMETRY...</span>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden shadow-2xl">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-950/50 border-b border-slate-800 text-xs font-mono text-slate-500 uppercase tracking-wider">
                <th class="p-4">Time</th>
                <th class="p-4">Incident Title</th>
                <th class="p-4">Status</th>
                <th class="p-4">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 text-sm">
              {#each activeIncidents as incident}
                <tr class="hover:bg-slate-800/50 transition-colors group">
<td class="p-4 font-mono text-slate-400 whitespace-nowrap">
  {new Date(incident.created_at).toLocaleTimeString()}
</td>
                  <td class="p-4">
                    <div class="font-bold text-slate-200">{incident.title}</div>
                    <div class="text-xs text-slate-500 font-mono mt-1 group-hover:text-blue-400 transition-colors">
                      ID: {incident.id.slice(0, 8)}
                    </div>
                  </td>
                  <td class="p-4">
                    <span class={`px-2 py-1 rounded text-xs font-bold border ${getStatusColor(incident.status)}`}>
                      {incident.status.replace('⚡', '').replace('✅', '').split(':')[0]}
                    </span>
                  </td>
                  <td class="p-4">
                    <button class="text-xs text-slate-400 hover:text-white underline">
                      View Logs
                    </button>
                  </td>
                </tr>
              {:else}
                <tr>
                  <td colspan="4" class="p-8 text-center text-slate-500 font-mono italic">
                    No active incidents. The floor is quiet.
                  </td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="space-y-6">
      <div class="flex items-center justify-between">
        <h2 class="text-xl font-bold text-white">FORENSIC REPORTS</h2>
        <span class="text-xs font-mono text-slate-500">ARCHIVE</span>
      </div>

      <div class="bg-slate-900 border border-slate-800 rounded-lg p-6 shadow-2xl h-full">
        <ul class="space-y-4">
          {#each recentReports as report}
            <li class="flex items-start gap-3 pb-4 border-b border-slate-800 last:border-0 last:pb-0 group cursor-pointer hover:bg-slate-800/50 p-2 rounded -mx-2 transition-colors">
              <div class="bg-slate-800 p-2 rounded text-slate-400 group-hover:text-white group-hover:bg-slate-700 transition-colors">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-bold text-slate-200 truncate">{report.sop_used || 'Unknown SOP'}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs font-mono text-slate-500">{new Date(report.archived_at).toLocaleDateString()}</span>
                  <span class="text-xs text-slate-600">•</span>
                  <span class="text-xs text-emerald-500">Verified</span>
                </div>
              </div>
            </li>
          {:else}
             <li class="text-center text-slate-500 font-mono text-xs py-10">
               Archive is empty.
             </li>
          {/each}
        </ul>
        <button class="w-full mt-6 py-2 border border-slate-700 text-slate-400 text-xs font-bold rounded hover:bg-slate-800 transition-colors">
          OPEN ARCHIVE VAULT
        </button>
      </div>
    </div>

  </div>
</div>