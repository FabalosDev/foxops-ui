<script>
  import { onMount } from 'svelte';

  // LIVE DEMO LOGIC (Reused from your specific injector)
  const webhookUrl = "https://hook.eu2.make.com/h26b91d9pvhe1oywrjofh5khpenyq7rb";
  let loading = false;
  let status = "";
  let payloadVisible = false;

  const demoPayload = {
    "tenant": { "id": "FAB-IND-01", "name": "Festo Industrial Plant" },
    "user": { "email": "judge@make.com" },
    "incident": {
      "id": "5b97ed94-0d0a-4852",
      "title": "Actuator Cycle Timeout - Station 04",
      "status": "⚡ ACTIVE: SELF-HEALING CYCLE",
      "priority": "MEDIUM",
      "raw_error": "E-2044 // LATENCY: 450ms // SENSOR_S3_FAIL",
      "sop_title": "Pneumatic Valve Reset Protocol V2",
      "sop_procedure": "Step 1: Isolate VUVG Valve.\nStep 2: Cycle Solenoid."
    }
  };

  async function triggerDemo() {
    loading = true;
    status = "Injecting Payload to FoxOps Engine...";
    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoPayload)
      });
      if (response.ok) status = "✅ INJECTION SUCCESSFUL: Watch the Dashboard.";
      else status = "❌ ENGINE ERROR: " + response.statusText;
    } catch (err) {
      status = "❌ CONNECTION FAILED: " + err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500 selection:text-slate-900">

  <header class="relative border-b border-slate-800 bg-[url('/grid-pattern.svg')] bg-fixed">
    <div class="max-w-7xl mx-auto px-6 py-24 lg:py-32">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 mb-6">
        <span class="relative flex h-2 w-2">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
        SYSTEM ONLINE: v1.0.0
      </div>

      <h1 class="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
        FoxOps <span class="text-slate-600">Autonomy</span>
      </h1>
      <p class="text-xl text-slate-400 max-w-2xl leading-relaxed">
        Bridging <span class="text-blue-400">AI Reasoning</span> with <span class="text-emerald-400">Industrial Execution</span>.
        An idempotent, self-healing engine that turns silent failures into auditable assets.
      </p>

      <div class="mt-10 flex gap-4">
        <a href="#demo" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition-all">
          Live Simulation
        </a>
        <a href="https://github.com/FabalosDev/foxops-ui" target="_blank" class="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold rounded transition-all">
          View Repository
        </a>
      </div>
    </div>
  </header>

  <section class="py-20 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16">
      <div>
        <h2 class="text-2xl font-bold text-rose-400 mb-4 font-mono">// THE PROBLEM</h2>
        <h3 class="text-3xl text-white font-bold mb-6">The "Black Hole" of Downtime</h3>
        <p class="text-slate-400 mb-4">
          In industrial automation, undocumented fixes are revenue leaks. When a technician fixes a sensor but doesn't log it, the knowledge is lost.
        </p>
        <ul class="space-y-3 mt-6">
          <li class="flex items-start gap-3 text-slate-300">
            <span class="text-rose-500 mt-1">✕</span> Ghost Errors (No logs, no history)
          </li>
          <li class="flex items-start gap-3 text-slate-300">
            <span class="text-rose-500 mt-1">✕</span> Human Bottlenecks at 3 AM
          </li>
          <li class="flex items-start gap-3 text-slate-300">
            <span class="text-rose-500 mt-1">✕</span> Fragile JSON handling in legacy systems
          </li>
        </ul>
      </div>

      <div>
        <h2 class="text-2xl font-bold text-emerald-400 mb-4 font-mono">// THE FOXOPS SOLUTION</h2>
        <h3 class="text-3xl text-white font-bold mb-6">If it's not documented, it didn't happen.</h3>
        <p class="text-slate-400 mb-4">
          We built a "Senior Architect" engine that doesn't just fix the machine—it writes the paperwork.
        </p>
        <ul class="space-y-3 mt-6">
          <li class="flex items-start gap-3 text-slate-300">
            <span class="text-emerald-500 mt-1">✓</span> <b>Self-Healing:</b> Vector-matched SOP execution
          </li>
          <li class="flex items-start gap-3 text-slate-300">
            <span class="text-blue-500 mt-1">✓</span> <b>Teaching:</b> Gemini drafts new SOPs for unknown errors
          </li>
          <li class="flex items-start gap-3 text-slate-300">
            <span class="text-purple-500 mt-1">✓</span> <b>Forensics:</b> Automated HTML/PDF Report generation
          </li>
        </ul>
      </div>
    </div>
  </section>

  <section class="py-20 bg-slate-900 border-b border-slate-800">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-12">
        <h2 class="text-2xl font-bold text-blue-400 font-mono mb-2">// SYSTEM ARCHITECTURE</h2>
        <p class="text-slate-400">Orchestrated via Make.com + Supabase + Gemini 1.5 Pro</p>
      </div>

      <div class="bg-white p-4 rounded lg:p-10 overflow-hidden shadow-2xl shadow-black/50">
        <div class="aspect-video bg-slate-100 flex items-center justify-center text-slate-400 border border-slate-200 rounded">
          <div class="bg-white p-2 rounded lg:p-4 overflow-hidden shadow-2xl shadow-black/50">
  <img
    src="/flowchart.png"
    alt="FoxOps Architecture Flowchart"
    class="w-full h-auto rounded border border-slate-200"
  />
</div>
        </div>
      </div>
    </div>
  </section>

  <section id="demo" class="py-20">
    <div class="max-w-4xl mx-auto px-6">
      <div class="bg-slate-900 border border-slate-700 rounded-lg overflow-hidden shadow-2xl">
        <div class="p-6 border-b border-slate-700 bg-slate-800/50 flex justify-between items-center">
          <h3 class="text-xl font-bold text-white flex items-center gap-2">
            <span class="w-3 h-3 rounded-full bg-emerald-500"></span>
            Live Simulation Terminal
          </h3>
          <span class="text-xs font-mono text-slate-500">HOOK: ...pvhe1oywrjofh5khpenyq7rb</span>
        </div>

        <div class="p-8 space-y-6">
          <p class="text-slate-300">
            Click the button below to inject a <span class="text-emerald-400 font-mono">Real Industrial Payload</span> into the FoxOps Engine. This will trigger the Vector Search and Self-Healing logic in real-time.
          </p>

          <div class="bg-black/50 p-4 rounded border border-slate-800 font-mono text-xs text-slate-400 overflow-x-auto relative group">
             <button on:click={() => payloadVisible = !payloadVisible} class="absolute top-2 right-2 text-xs text-blue-400 hover:text-white uppercase">
                {payloadVisible ? 'Hide' : 'Show'} Payload
             </button>
             {#if payloadVisible}
               <pre>{JSON.stringify(demoPayload, null, 2)}</pre>
             {:else}
               <div class="flex items-center gap-2">
                 <span class="text-emerald-500">></span> Payload ready: E-2044 Pneumatic Fault (Festo)
               </div>
             {/if}
          </div>

          <button
            on:click={triggerDemo}
            disabled={loading}
            class="w-full py-4 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 text-white font-bold rounded transition-all uppercase tracking-widest flex items-center justify-center gap-3"
          >
            {#if loading}
              <span class="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              Transmitting to Engine Room...
            {:else}
              Execute Self-Healing Cycle
            {/if}
          </button>

          {#if status}
            <div class="p-4 rounded border {status.includes('✅') ? 'bg-emerald-900/20 border-emerald-800 text-emerald-400' : 'bg-rose-900/20 border-rose-800 text-rose-400'} font-mono text-sm text-center">
              {status}
            </div>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <footer class="py-12 border-t border-slate-800 text-center text-slate-500 text-sm">
    <p class="font-mono mb-2">FABALOS PROTOCOL // LANE 2: ENGINEERING</p>
    <p>&copy; 2026 Frank Abalos. Built for the Master of Make Challenge.</p>
  </footer>
</div>