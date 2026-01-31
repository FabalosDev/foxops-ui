<script lang="ts">
  import { Cpu, Terminal, Zap, Activity, LayoutDashboard } from 'lucide-svelte';

  // --- CONFIGURATION ---
  const API_ENDPOINT = "/api/incidents/ingest";

  // --- DATA: FLATTENED PAYLOAD ---
  const payload = {
    origin: "foxops_portal",
    priority: "HIGH",
    user_email: "demo+festo@fabalos.com",
    user_company: "Festo Industrial Plant",
    user_name: "FoxOps Demo User",
    user_id: "FAB-IND-01",
    incident_title: "Actuator Cycle Timeout - Station 04",
    incident_raw: "> ERROR_CODE: E-2044 // LATENCY_DETECTED: 450ms // COMPONENT: VUVG-L10-B52 // STATE: INCOMPLETE_STROKE // Pneumatic pressure nominal (6.2 bar) but proximity sensor S3 failed to trigger within window.",
    timestamp: "2026-01-27T21:40:00Z"
  };

  let loading = false;
  let status = "";

  async function sendToMainEngine() {
    loading = true;
    status = "Transmitting Simulation Payload...";

    try {
      // Hit our own server endpoint
      const response = await fetch(API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        status = `✅ Injection Successful: ID ${data.id}`;
      } else {
        status = `❌ Server Error: ${response.statusText}`;
      }
    } catch (err) {
      status = "❌ Network Connection Failed";
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-[#0F172A] text-slate-300 font-sans">
  <header class="fixed top-0 left-0 w-full z-50 border-b border-slate-800 bg-[#0B1121]/90 backdrop-blur-md">
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
      <div class="flex items-center gap-4">
        <div class="h-8 w-8 rounded bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
          <Cpu size={18} class="text-orange-500" />
        </div>
        <h1 class="text-lg font-bold text-white tracking-tight">
          FoxOps <span class="text-slate-500">Terminal // Production Injector</span>
        </h1>
      </div>
    </div>
  </header>

  <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-28 pb-20">

    <aside class="hidden lg:block lg:col-span-3">
      <div class="sticky top-32 space-y-6">
        <div class="p-4 rounded-lg bg-orange-500/5 border border-orange-500/10">
          <p class="text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-2">Active Protocol</p>
          <p class="text-xs text-slate-400 leading-relaxed">Sending flat telemetry to Server API.</p>
        </div>
        <nav class="space-y-1 text-sm">
          <div class="px-4 py-2 text-white font-bold bg-white/5 rounded-lg flex items-center gap-3 italic">
            <Terminal size={16} class="text-orange-500" /> Fault Injection Mode
          </div>
        </nav>
      </div>
    </aside>

    <main class="lg:col-span-9 space-y-8">
      <section class="p-8 rounded-xl bg-slate-900 border border-slate-800 shadow-2xl">
        <div class="flex items-center gap-3 mb-6">
          <div class="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <LayoutDashboard size={20} class="text-orange-500" />
          </div>
          <div>
            <h2 class="text-xl font-bold text-white">Main Engine Injector</h2>
            <p class="text-xs text-slate-500 uppercase tracking-widest">Target: {payload.user_company}</p>
          </div>
        </div>

        <div class="bg-black/50 rounded-lg border border-slate-800 p-6 mb-8 relative">
          <div class="absolute top-2 right-4 text-[10px] font-mono text-slate-600 uppercase">Buffer_v5.0 (Flat)</div>
          <pre class="text-xs md:text-sm font-mono text-orange-400/80 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(payload, null, 2)}</pre>
        </div>

        <div class="flex flex-col gap-4">
          <button
            on:click={sendToMainEngine}
            disabled={loading}
            class="w-full py-4 bg-orange-600 hover:bg-orange-500 disabled:bg-slate-800 text-white font-black uppercase tracking-[0.2em] rounded-lg transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-900/20"
          >
            {#if loading}
              <Activity size={18} class="animate-spin" /> Transmitting...
            {:else}
              <Zap size={18} /> Inject to Main Engine
            {/if}
          </button>

          {#if status}
            <div class="p-4 rounded bg-[#0B1121] border border-slate-800 text-center">
              <p class="text-xs font-mono {status.includes('✅') ? 'text-emerald-400' : 'text-rose-400'} uppercase tracking-widest">
                {status}
              </p>
            </div>
          {/if}
        </div>
      </section>
    </main>
  </div>
</div>