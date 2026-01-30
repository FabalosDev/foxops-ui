<script>
  import { Cpu, PlayCircle, Activity, Server, ShieldAlert, Wifi, Trash2 } from 'lucide-svelte';

  const tenants = [
    { id: 'FAB-IND-01', name: 'Festo Industrial Plant', contact_email: 'demo+festo@fabalos.com', contact_name: 'Chief Engineer Hans' },
    { id: 'FAB-SFT-02', name: 'SvelteSoft Solutions', contact_email: 'demo+sveltesoft@fabalos.com', contact_name: 'DevOps Lead Sarah' },
    { id: 'FAB-AGR-03', name: 'AgriFlow Automation', contact_email: 'demo+agriflow@fabalos.com', contact_name: 'Field Tech Mike' }
  ];

const sources = [
    {
      id: 'support_portal',
      label: '1. Support Ticket (Human)',
      origin: 'foxops.fabalos.com/support',
      priority: 'LOW',
      defaultTitle: 'Reporting Module Error',
      defaultError: 'The monthly PDF export is failing with a 504 Gateway Timeout. This is blocking the finance team.'
    },
    {
      id: 'make_workflow',
      label: '2. Workflow Error (Automation)',
      origin: 'Make_Error_Handler_v2',
      priority: 'HIGH',
      defaultTitle: 'HTTP 429: Rate Limit Exceeded',
      defaultError: 'Automation WF-9921 failed: OpenAI API rate limit reached. Retrying in 60 seconds.'
    },
    {
      id: 'iot_gateway',
      label: '3. IoT Threshold (Machine)',
      origin: 'Festo_CPX_IoT_Gateway',
      priority: 'CRITICAL',
      defaultTitle: 'CRITICAL: Main Air Pressure Low',
      defaultError: 'Sensor P1_MAIN_SUPPLY reports 3.2 bar. This is below the 4.0 bar safety threshold.'
    },
    {
      id: 'system_health',
      label: '4. Health Check (Internal)',
      origin: 'Supabase_Cron_Monitor',
      priority: 'HIGH',
      defaultTitle: 'Database Connection Spike',
      defaultError: 'Internal Monitor: Active database connections have reached 92% capacity. Potential N+1 query detected.'
    }
  ];

  let clientId = tenants[0].id;
  let selectedSource = sources[0];
  let ticketTitle = selectedSource.defaultTitle;
  let rawError = selectedSource.defaultError;
  let status = "idle";

  function handleSourceChange() {
    ticketTitle = selectedSource.defaultTitle;
    rawError = selectedSource.defaultError;
  }

  function clearForm() {
    ticketTitle = "";
    rawError = "";
  }

  async function submitTicket() {
    status = "loading";
    const webhookUrl = "https://normalizer.fabaverse.workers.dev/";
    const selectedTenant = tenants.find(t => t.id === clientId);

    const payload = {
      payload: {
        input: {
          meta: { ref_id: crypto.randomUUID(), origin: selectedSource.origin, priority: selectedSource.priority },
          identity: { user_email: selectedTenant.contact_email, user_company: selectedTenant.name, user_name: selectedTenant.contact_name, user_id: selectedTenant.id },
          incident: { title: ticketTitle, timestamp: new Date().toISOString(), raw: rawError }
        }
      }
    };

    try {
      const res = await fetch(webhookUrl, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (res.ok) { status = "success"; setTimeout(() => { status = "idle" }, 2000); }
      else { status = "error"; }
    } catch (err) { status = "error"; }
  }
</script>

<header class="fixed top-0 left-0 w-full z-50 border-b border-slate-800 bg-[#0B1121]/90 backdrop-blur-md transition-all duration-300">
  <div class="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
    <div class="flex items-center gap-4">
      <div class="h-8 w-8 rounded bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
        <Cpu size={18} class="text-orange-500" />
      </div>
      <div>
        <h1 class="text-lg font-bold text-white leading-tight">
          FoxOps <span class="text-slate-500">Autonomous Infrastructure</span>
        </h1>
        <div class="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mt-1">
          Make Challenge 2026
        </div>
      </div>
    </div>
    <a href="/foxops" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-2">
      <PlayCircle size={14} /> Open Dashboard
    </a>
  </div>
</header>

<div class="min-h-screen bg-slate-900 text-slate-100 pt-32 pb-20 px-6 font-mono">
  <div class="max-w-3xl mx-auto border border-blue-500/30 p-8 bg-slate-800 shadow-2xl rounded-lg">

    <div class="flex justify-between items-center border-b border-slate-700 pb-4 mb-8">
      <div>
        <h1 class="text-xl font-bold text-slate-200">INCIDENT_SIMULATOR</h1>
        <p class="text-[10px] text-slate-500 uppercase tracking-widest mt-1">Lane-Based Telemetry Injection</p>
      </div>
      <button on:click={clearForm} class="text-[10px] text-slate-500 hover:text-rose-400 flex items-center gap-1 transition-colors uppercase font-bold">
        <Trash2 size={12} /> Clear_Terminal
      </button>
    </div>

    <div class="grid grid-cols-2 gap-4 mb-8">
      <div class="p-4 bg-slate-900 border border-slate-700 rounded">
        <label class="block text-[10px] uppercase text-blue-400 mb-2 font-bold">1. Target_Tenant</label>
        <select bind:value={clientId} class="w-full bg-slate-800 border border-slate-600 p-2 text-sm focus:border-blue-500 outline-none rounded text-white">
          {#each tenants as tenant}
            <option value={tenant.id}>{tenant.name}</option>
          {/each}
        </select>
      </div>
      <div class="p-4 bg-slate-900 border border-slate-700 rounded">
        <label class="block text-[10px] uppercase text-orange-400 mb-2 font-bold">2. Signal_Source</label>
        <select bind:value={selectedSource} on:change={handleSourceChange} class="w-full bg-slate-800 border border-slate-600 p-2 text-sm focus:border-orange-500 outline-none rounded text-white">
          {#each sources as source}
            <option value={source}>{source.label}</option>
          {/each}
        </select>
      </div>
    </div>

    <form on:submit|preventDefault={submitTicket} class="space-y-6">
      <div>
        <label class="block text-xs uppercase text-slate-400 mb-2 font-bold tracking-widest">INCIDENT_TITLE</label>
        <input bind:value={ticketTitle} class="w-full bg-slate-900 border border-slate-700 p-3 rounded focus:border-blue-500 outline-none" placeholder="Enter incident title..." />
      </div>

      <div>
        <label class="block text-xs uppercase text-slate-400 mb-2 font-bold tracking-widest">INCIDENT_RAW (MESSAGE_BOX)</label>
        <textarea bind:value={rawError} rows="8" class="w-full bg-black/40 border border-slate-700 p-4 rounded font-mono text-xs text-emerald-400 focus:border-blue-500 outline-none leading-relaxed shadow-inner" placeholder="Paste logs or type manual details..."></textarea>
      </div>

      <button type="submit" disabled={status === 'loading'} class="w-full bg-blue-600 hover:bg-blue-500 py-4 font-bold uppercase tracking-widest transition rounded shadow-lg shadow-blue-900/20">
        {status === 'loading' ? 'INJECTING_PAYLOAD...' : 'FIRE_WEBHOOK'}
      </button>

      {#if status === 'success'}
        <p class="text-center text-green-400 text-[10px] mt-4 uppercase font-bold animate-pulse">✓ Telemetry_Logged_Success</p>
      {/if}
    </form>
  </div>
</div>