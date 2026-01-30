<script lang="ts">
  import {
    Ticket, Workflow, Cpu, Activity, X, Play, Terminal,
    CheckCircle2, AlertTriangle, Loader2
  } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  // CONFIG: Hits your local server endpoint
  const API_ENDPOINT = "/api/incidents/ingest";

  // --- DATA: SCENARIOS (Flat JSON Protocol) ---
  const scenarios = [
    {
      id: 'ticket-login',
      title: 'Support: Login Issue',
      icon: Ticket,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      desc: 'User reports 403 Forbidden on password reset.',
      payload: {
        origin: "foxops_portal",
        priority: "LOW",
        user_company: "Logistics Co.",
        user_name: "Sarah Jenkins",
        incident_title: "Cannot reset password",
        incident_raw: "User reports receiving 403 Forbidden when clicking the reset link."
      }
    },
    {
      id: 'workflow-rate',
      title: 'Workflow: Rate Limit',
      icon: Workflow,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      desc: 'OpenAI 429 Error triggered in Scenario B.',
      payload: {
        origin: "make_scenario_b",
        priority: "HIGH",
        user_company: "Fabalos Automation",
        user_name: "Make Bot",
        incident_title: "HTTP 429: Rate Limit Exceeded",
        incident_raw: "Module: OpenAI GPT-4 // Error: 429 Too Many Requests. Retry-After: 20s."
      }
    },
    {
      id: 'iot-pressure',
      title: 'IoT: Low Pressure',
      icon: Cpu,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      desc: 'Festo Sensor reporting 3.2 bar (Threshold 4.0).',
      payload: {
        origin: "festo_cp_factory",
        priority: "CRITICAL",
        user_company: "Festo Plant A",
        user_name: "Station 01 PLC",
        incident_title: "Pressure Drop Detected - Main Line",
        incident_raw: "ERROR_CODE: P-LOW-01 // VALUE: 3.2 bar // ACTION: EMERGENCY_STOP"
      }
    },
    {
      id: 'health-api',
      title: 'Health: API Down',
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      desc: 'Public API returning 503 Service Unavailable.',
      payload: {
        origin: "uptime_robot",
        priority: "CRITICAL",
        user_company: "Fabalos Public API",
        user_name: "Uptime Bot",
        incident_title: "API DOWN: https://api.fabalos.com",
        incident_raw: "Status: 503 Service Unavailable. Checks failed from: US-West, EU-Central."
      }
    }
  ];

  // --- STATE (Svelte 5 Runes) ---
  let activeScenario = $state<any>(null);
  let loading = $state(false);
  let success = $state(false);
  let logs = $state<string[]>([]);

  // --- UI ACTIONS ---
  function openModal(scenario: any) {
    activeScenario = scenario;
    success = false;
    logs = [];
  }

  function closeModal() {
    activeScenario = null;
    loading = false;
  }

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  // --- INJECTOR ---
  async function injectFault() {
    if (loading) return;
    loading = true;
    logs = [];

    logs = [...logs, `> INIT_PROTOCOL: ${activeScenario.id.toUpperCase()}`];
    await wait(200);
    logs = [...logs, `> TARGET: ${API_ENDPOINT}`];

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(activeScenario.payload)
      });

      if (!response.ok) throw new Error(`Status ${response.status}`);

      logs = [...logs, `> 200 OK: Payload Accepted`];
      success = true;

    } catch (err: any) {
      logs = [...logs, `> ERROR: ${err.message}`];
    } finally {
      loading = false;
    }
  }
</script>

<section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {#each scenarios as item}
    <button
      onclick={() => openModal(item)}
      class="group text-left p-3 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-slate-800 transition-all hover:border-white/10 relative overflow-hidden"
    >
      <div class="relative z-10">
        <div class="flex items-start justify-between mb-2">
          <div class="p-1.5 rounded-lg {item.bg} {item.border} border">
            <svelte:component this={item.icon} size={16} class={item.color} />
          </div>
          <div class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
            <Play size={14} />
          </div>
        </div>
        <h3 class="text-xs font-bold text-white mb-0.5">{item.title}</h3>
        <p class="text-[10px] text-slate-500 leading-tight">{item.desc}</p>
      </div>
    </button>
  {/each}
</section>

{#if activeScenario}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick={closeModal} role="button" tabindex="0" onkeydown={(e) => e.key === 'Escape' && closeModal()}></div>

    <div class="relative w-full max-w-lg bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col" transition:fly={{ y: 20, duration: 300 }}>

      <div class="px-5 py-3 border-b border-slate-700 flex items-center justify-between bg-[#0B1121]">
        <div class="flex items-center gap-2">
          <svelte:component this={activeScenario.icon} size={16} class={activeScenario.color} />
          <span class="font-bold text-white text-sm">Inject {activeScenario.title}</span>
        </div>
        <button onclick={closeModal} class="text-slate-500 hover:text-white"><X size={18} /></button>
      </div>

      <div class="p-5 space-y-4">
        <div class="p-3 rounded-lg bg-black border border-slate-800 font-mono text-[10px] h-32 overflow-y-auto space-y-1">
          {#if logs.length === 0}
             <span class="text-slate-600">> Ready to inject...</span>
          {/if}
          {#each logs as log}
            <div class="text-slate-300 border-l-2 border-slate-700 pl-2">{log}</div>
          {/each}
          {#if loading}
            <span class="animate-pulse text-orange-500">_</span>
          {/if}
        </div>

        {#if success}
          <div in:fade class="p-3 rounded bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-2 text-emerald-400">
            <CheckCircle2 size={16} />
            <span class="text-xs font-bold">Injection Successful</span>
          </div>
        {/if}
      </div>

      <div class="p-4 border-t border-slate-700 bg-[#0B1121] flex justify-end gap-3">
        <button onclick={closeModal} class="px-4 py-2 rounded-lg text-xs font-bold text-slate-400 hover:text-white">Cancel</button>
        <button
          onclick={injectFault}
          disabled={loading || success}
          class="px-5 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2"
        >
          {#if loading} <Loader2 size={14} class="animate-spin" /> Injecting...
          {:else if success} Done
          {:else} <AlertTriangle size={14} /> Inject Fault
          {/if}
        </button>
      </div>
    </div>
  </div>
{/if}