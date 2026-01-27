<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Cpu,
    Network,
    Database,
    ShieldCheck,
    PlayCircle,
    Layers,
    Terminal
  } from 'lucide-svelte';

  // --- NAVIGATION DATA ---
  const sections = [
    { id: 'executive-summary', label: 'Executive Summary', icon: Cpu },
    { id: 'problem-statement', label: 'The Downtime Gap', icon: ShieldCheck },
    { id: 'architecture', label: 'System Architecture', icon: Network },
    { id: 'mcp-integration', label: 'MCP Protocol', icon: Terminal },
    { id: 'data-schema', label: 'Data Schema', icon: Database },
    { id: 'scenarios', label: 'Live Scenarios', icon: Layers },
    { id: 'demo', label: 'Video Demonstration', icon: PlayCircle }
  ];

  // --- JSON DATA ---
  const toolDefinition = {
    "name": "match_sops",
    "description": "Finds the correct Standard Operating Procedure",
    "input_schema": {
      "type": "object",
      "properties": {
        "error_vector": {
          "type": "string",
          "description": "The raw error log from the machine"
        },
        "severity": {
          "type": "string",
          "enum": ["LOW", "CRITICAL"]
        }
      }
    }
  };

  let activeSection = 'executive-summary';

  function handleScroll() {
    const scrollPosition = window.scrollY + 200; // Increased offset for fixed header
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight > scrollPosition)) {
        activeSection = section.id;
      }
    }
  }
</script>

<svelte:window on:scroll={handleScroll} />


<div class="min-h-screen bg-[#0F172A] text-slate-300 font-sans selection:bg-orange-500/30">

<header class="fixed top-0 left-0 w-full z-50 border-b border-slate-800 bg-[#0B1121]/90 backdrop-blur-md transition-all duration-300">

    <div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

    <div class="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

      <div class="flex items-center gap-4">
        <div class="hidden md:flex h-8 w-8 rounded bg-orange-500/10 items-center justify-center border border-orange-500/20">
          <Cpu size={18} class="text-orange-500" />
        </div>

        <div>
          <div class="flex items-center gap-3">
            <h1 class="text-sm md:text-lg font-bold tracking-tight text-white leading-tight">
              FoxOps <span class="text-slate-500">Autonomous Self-Healing Infrastructure & SOP Generation</span>
            </h1>
          </div>
          <div class="flex items-center gap-2 mt-1">
            <div class="inline-flex px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              Make Challenge 2026
            </div>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <a href="#demo" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-2">
          <PlayCircle size={14} /> <span class="hidden sm:inline">Watch Demo</span>
        </a>
      </div>

    </div>
  </header>

  <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 pt-28 pb-20">

    <aside class="hidden lg:block lg:col-span-3 relative">
      <div class="sticky top-32 space-y-8">

        <nav class="space-y-1">
          {#each sections as section}
            <a href="#{section.id}"
               class="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
               {activeSection === section.id
                 ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20'
                 : 'text-slate-400 hover:text-white hover:bg-slate-800'}"
            >
              <svelte:component this={section.icon} size={16} />
              {section.label}
            </a>
          {/each}
        </nav>

        <div class="pt-6 border-t border-slate-800 space-y-3">
          <div class="px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Resources</div>
          <a href="https://github.com/FabalosDev/foxops-ui" target="_blank" class="block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            View GitHub Repo
          </a>
          <a href="https://fabalos.com" target="_blank" class="block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors">
            Fabalos Automation
          </a>
        </div>

      </div>
    </aside>

    <main class="lg:col-span-9 space-y-20">
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

      <section id="executive-summary" class="scroll-mt-32 space-y-6">
        <h2 class="text-2xl font-bold text-white">Executive Summary</h2>
        <p class="text-slate-400 leading-relaxed text-lg">
          FoxOps is an idempotent, self-healing engine that turns silent failures into auditable assets.
          It uses <strong>Make</strong> as a Serverless MCP Host to give Gemini 2.0 direct control over industrial infrastructure.
        </p>
        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Objective</div>
            <div class="text-white font-medium">Scale Support Logic</div>
          </div>
          <div>
            <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Engine</div>
            <div class="text-white font-medium">Make + Gemini 2.0</div>
          </div>
          <div>
            <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Protocol</div>
            <div class="text-white font-medium">MCP Serverless</div>
          </div>
        </div>
      </section>

      <section id="problem-statement" class="scroll-mt-32 space-y-12 border-b border-slate-800 pb-20">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <ShieldCheck class="text-orange-500" /> The Downtime Gap
        </h2>

        <div class="grid lg:grid-cols-2 gap-16">

          <div>
            <h2 class="text-xs font-bold text-rose-400 mb-4 font-mono tracking-widest uppercase">The Problem</h2>
            <h3 class="text-3xl text-white font-bold mb-6">The "Black Hole" of Downtime</h3>
            <p class="text-slate-400 mb-6 leading-relaxed">
              In industrial automation, downtime costs <strong>$10k/minute</strong>. When a technician fixes a sensor but doesn't log it, that knowledge is lost forever.
            </p>

            <ul class="space-y-3 mb-8">
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

            <div class="bg-rose-500/5 border border-rose-500/10 p-4 rounded-lg text-rose-200 text-xs font-mono leading-loose">
              > CRITICAL_ALERT: Valve_Stiction_Detected<br>
              > HUMAN_RESPONSE_TIME: 45 Minutes<br>
              > REVENUE_LOST: $450,000
            </div>
          </div>

          <div>
            <h2 class="text-xs font-bold text-emerald-400 mb-4 font-mono tracking-widest uppercase">The FoxOps Solution</h2>
            <h3 class="text-3xl text-white font-bold mb-6">If it's not documented, it didn't happen.</h3>
            <p class="text-slate-400 mb-6 leading-relaxed">
              We built a "Senior Architect" engine that doesn't just fix the machine—it writes the paperwork.
              FoxOps detects, analyzes, and heals itself before a human is even notified.
            </p>

            <ul class="space-y-4">
              <li class="flex items-start gap-3 text-slate-300">
                <div class="mt-1 h-5 w-5 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">✓</div>
                <div>
                  <b class="text-white">Self-Healing:</b>
                  <span class="block text-sm text-slate-400">Vector-matched SOP execution via Supabase.</span>
                </div>
              </li>
              <li class="flex items-start gap-3 text-slate-300">
                <div class="mt-1 h-5 w-5 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">✓</div>
                <div>
                  <b class="text-white">Teaching:</b>
                  <span class="block text-sm text-slate-400">Gemini drafts new SOPs for unknown errors.</span>
                </div>
              </li>
              <li class="flex items-start gap-3 text-slate-300">
                <div class="mt-1 h-5 w-5 rounded bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-500">✓</div>
                <div>
                  <b class="text-white">Forensics:</b>
                  <span class="block text-sm text-slate-400">Automated HTML/PDF Post-Mortem reports.</span>
                </div>
              </li>
            </ul>

            <div class="mt-8 flex items-center gap-2 text-emerald-400 font-mono text-xs">
              <span class="animate-pulse">●</span> FOXOPS_RESPONSE_TIME: 400 Milliseconds
            </div>
          </div>

        </div>
      </section>

      <section id="architecture" class="scroll-mt-32 space-y-8">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <Network class="text-orange-500" /> Architecture & Stack
        </h2>
        <p class="text-slate-400">
          The system operates on a 4-Lane Framework, utilizing <strong>Supabase</strong> as the "Hard Drive" for knowledge (SOPs)
          and <strong>Make</strong> as the "Motherboard" for orchestration.
        </p>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div class="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <div class="font-bold text-white mb-1">Make</div>
            <div class="text-xs text-slate-500">Orchestration</div>
          </div>
          <div class="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <div class="font-bold text-white mb-1">Supabase</div>
            <div class="text-xs text-slate-500">Vector DB</div>
          </div>
          <div class="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <div class="font-bold text-white mb-1">Gemini</div>
            <div class="text-xs text-slate-500">Reasoning Core</div>
          </div>
          <div class="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center">
            <div class="font-bold text-white mb-1">SvelteKit</div>
            <div class="text-xs text-slate-500">Interface</div>
          </div>
        </div>

    <div class="max-w-7xl mx-auto px-6 py-12">
      <div class="relative rounded-xl bg-[#0B1121] border border-slate-800 shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/5">

        <div class="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 backdrop-blur-sm">
          <div class="flex items-center gap-2">
            <div class="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
            <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Architecture v1.0</span>
          </div>
          <div class="flex gap-1.5 opacity-50">
            <div class="h-1.5 w-1.5 rounded-full bg-slate-600"></div>
            <div class="h-1.5 w-1.5 rounded-full bg-slate-600"></div>
            <div class="h-1.5 w-1.5 rounded-full bg-slate-600"></div>
          </div>
        </div>

        <div class="relative p-4 lg:p-10 flex items-center justify-center bg-[#0F172A] overflow-hidden">

          <div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-transparent to-transparent pointer-events-none"></div>

          <img
            src="/flowchart.png"
            alt="FoxOps Architecture Flowchart"
            class="relative z-10 w-full h-auto max-w-5xl rounded-lg shadow-lg filter invert brightness-125 contrast-125 opacity-90"
          />

        </div>

        <div class="px-4 py-2 bg-[#050505] border-t border-white/5 text-[9px] font-mono text-slate-600 flex justify-between">
          <span>SOURCE: Chart is crafted in Mermaid.js</span>
          <span>RENDER: Vectorscope (Inverted)</span>
        </div>

      </div>
    </div>
      </section>

      <section id="mcp-integration" class="scroll-mt-32 space-y-6">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <Terminal class="text-orange-500" /> MCP Integration
        </h2>
        <p class="text-slate-400">
          Unlike standard chatbots, FoxOps exposes Make scenarios as <strong>MCP Tools</strong>.
          This allows the AI to "reach out" into the physical world to perform diagnostics.
        </p>

        <div class="bg-[#0B1121] p-6 rounded-lg border border-slate-800 overflow-hidden">
          <div class="flex items-center justify-between mb-4 border-b border-white/5 pb-2">
            <span class="text-xs font-mono text-slate-500">tool_definition.json</span>
            <span class="text-xs font-mono text-emerald-500">Valid JSON</span>
          </div>
          <pre class="font-mono text-xs md:text-sm text-slate-300 overflow-x-auto">{JSON.stringify(toolDefinition, null, 2)}</pre>
        </div>
      </section>

      <section id="data-schema" class="scroll-mt-32 space-y-6">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <Database class="text-orange-500" /> Core Schema
        </h2>
        <p class="text-slate-400">
          We maintain two primary tables in Supabase to balance long-term knowledge with transactional activity.
        </p>

        <div class="space-y-4">
          <div class="border border-slate-800 rounded-lg overflow-hidden">
            <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 font-mono text-sm font-bold text-white">
              table: sops (The "Hard Drive")
            </div>
            <div class="p-4 bg-[#0B1121] text-xs font-mono text-slate-400 space-y-2">
              <div class="flex justify-between"><span class="text-blue-400">id</span> <span>uuid (PK)</span></div>
              <div class="flex justify-between"><span class="text-blue-400">embedding</span> <span>vector(1536)</span></div>
              <div class="flex justify-between"><span class="text-blue-400">workflow_description</span> <span>text</span></div>
              <div class="flex justify-between"><span class="text-blue-400">hit_count</span> <span>int8</span></div>
            </div>
          </div>

          <div class="border border-slate-800 rounded-lg overflow-hidden">
            <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 font-mono text-sm font-bold text-white">
              table: support_tickets (The "Activity Queue")
            </div>
            <div class="p-4 bg-[#0B1121] text-xs font-mono text-slate-400 space-y-2">
              <div class="flex justify-between"><span class="text-blue-400">ticket_id</span> <span>uuid (PK)</span></div>
              <div class="flex justify-between"><span class="text-blue-400">raw_error</span> <span>text</span></div>
              <div class="flex justify-between"><span class="text-blue-400">status</span> <span>enum ('investigating', 'healed')</span></div>
              <div class="flex justify-between"><span class="text-blue-400">sop_match_id</span> <span>uuid (FK)</span></div>
            </div>
          </div>
        </div>
      </section>

      <section id="scenarios" class="scroll-mt-32 space-y-6">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <Layers class="text-orange-500" /> Stress Test Scenarios
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div class="p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/30 transition-colors">
            <div class="text-orange-500 text-xs font-bold uppercase mb-2">Scenario 01</div>
            <h3 class="text-white font-bold text-lg mb-2">Pneumatic Valve Stiction</h3>
            <p class="text-sm text-slate-400 mb-4">
              A Festo valve reports high friction. The system identifies "Lubrication Interval Missed" and schedules maintenance.
            </p>
            <div class="text-xs font-mono bg-black p-2 rounded text-slate-500">
              > Error: 0x4F_FRICTION_HIGH
            </div>
          </div>

          <div class="p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/30 transition-colors">
            <div class="text-blue-500 text-xs font-bold uppercase mb-2">Scenario 02</div>
            <h3 class="text-white font-bold text-lg mb-2">Database Connection Pool</h3>
            <p class="text-sm text-slate-400 mb-4">
              Dashboard fails with 500 error. System identifies "Max Connections Reached" and kills idle PID processes.
            </p>
            <div class="text-xs font-mono bg-black p-2 rounded text-slate-500">
              > Error: 500_INTERNAL_SERVER
            </div>
          </div>

        </div>
      </section>

      <section id="demo" class="scroll-mt-32 space-y-6 pb-20">
        <h2 class="text-2xl font-bold text-white flex items-center gap-3">
          <PlayCircle class="text-orange-500" /> Evidence
        </h2>

        <div class="aspect-video w-full rounded-xl bg-slate-900 border border-slate-800 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer">
          <div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
          <div class="h-16 w-16 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform z-10">
            <PlayCircle size={32} class="text-white" />
          </div>
          <p class="mt-4 text-slate-500 font-mono text-sm z-10">Click to Watch Full 3-Minute Breakdown</p>
        </div>
      </section>

    </main>

  </div>
</div>