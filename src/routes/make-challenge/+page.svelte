<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Cpu,
    Network,
    Database,
    ShieldCheck,
    PlayCircle,
    Layers,
    Terminal,
    Activity,
    Workflow,
    Ticket,
    Globe,
    Users
  } from 'lucide-svelte';

  // --- NAVIGATION DATA ---
  const sections = [
    { id: 'executive-summary', label: 'Executive Summary', icon: Cpu },
    { id: 'universal-intelligence', label: 'Universal Logic', icon: Globe }, // NEW
    { id: 'problem-statement', label: 'The Downtime Gap', icon: ShieldCheck },
    { id: 'architecture', label: 'System Architecture', icon: Network },
    { id: 'ingestion', label: 'Omnichannel Ingestion', icon: Users }, // NEW
    { id: 'mcp-integration', label: 'MCP Protocol', icon: Terminal },
    { id: 'data-schema', label: 'Data Schema', icon: Database },
    { id: 'rpa-case', label: 'Real-World RPA', icon: Activity }, // NEW
    { id: 'scenarios', label: 'Live Scenarios', icon: Layers },
    { id: 'demo', label: 'Video Demonstration', icon: PlayCircle }
  ];

  // --- JSON DATA (Kept for Display) ---
  const toolDefinition = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Initiate Triage Arguments",
    "type": "object",
    "properties": {
      "search_query": { "type": "string", "description": "A precise, semantic search query derived from the raw telemetry." },
      "clean_title": { "type": "string", "description": "A standardized, professional title for the incident report." },
      "priority": { "type": "string", "enum": ["LOW", "MEDIUM", "HIGH", "CRITICAL"], "description": "Severity level of the incident." },
      "detected_domain": { "type": "string", "description": "The suspected origin system (e.g., 'Stripe', 'Supabase', 'AWS')." },
      "logic_reasoning": { "type": "string", "description": "Brief technical justification for why this priority level was assigned." }
    },
    "required": ["search_query", "clean_title", "priority", "logic_reasoning"],
    "additionalProperties": false
  };

  let activeSection = 'executive-summary';

  function handleScroll() {
    const scrollPosition = window.scrollY + 200; // Offset for fixed header
    for (const section of sections) {
      const element = document.getElementById(section.id);
      if (element && element.offsetTop <= scrollPosition && (element.offsetTop + element.offsetHeight > scrollPosition)) {
        activeSection = section.id;
      }
    }
  }
</script>

<svelte:window on:scroll={handleScroll} />

  <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 pb-20">

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
          <div class="px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Logic Evolution</div>

          <a href="/flowchartv3.svg" target="_blank" class="block px-4 py-1 text-sm text-slate-400 hover:text-emerald-400 transition-colors flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span class="font-bold text-emerald-400">v3.0 Final</span> (Latest)
          </a>

          <a href="/flowchartv2.png" target="_blank" class="block px-4 py-1 text-sm text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
            <span>v2.0 Beta</span> (Revised)
          </a>

          <a href="/flowchartv1.png" target="_blank" class="block px-4 py-1 text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            <span>v1.0 Alpha</span> (Legacy)
          </a>
        </div>

        <div class="pt-6 border-t border-slate-800 space-y-3">
          <div class="px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Resources</div>

          <a href="https://github.com/FabalosDev/foxops-ui" target="_blank" class="block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            View GitHub Repo
          </a>

          <a href="https://community.make.com" target="_blank" class="block px-4 py-2 text-sm text-slate-400 hover:text-orange-400 transition-colors flex items-center gap-2">
             Make.com Community
          </a>
        </div>

        <div class="pt-6 border-t border-slate-800 space-y-3">
          <div class="px-4 text-xs font-bold uppercase tracking-widest text-slate-500">Ecosystem</div>

          <a href="https://fabalos.com" target="_blank" class="block px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-2">
            Fabalos Automation
          </a>

          <a href="https://floflux.com" target="_blank" class="block px-4 py-2 text-sm text-slate-400 hover:text-blue-400 transition-colors flex items-center gap-2">
             Floflux Distro
          </a>
        </div>

      </div>
    </aside>

    <main class="lg:col-span-9 space-y-20">

    <header class="relative border-b border-slate-800 bg-[url('/grid-pattern.svg')] bg-fixed rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50">
      <div class="px-6 py-16 lg:py-24">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono text-emerald-400 mb-6">
          <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          SYSTEM ONLINE: v2.0.0 (Universal)
        </div>

        <h1 class="text-4xl lg:text-6xl font-bold tracking-tight text-white mb-6">
          FoxOps <span class="text-slate-600">Autonomy</span>
        </h1>
        <p class="text-lg text-slate-400 max-w-2xl leading-relaxed">
          Bridging <span class="text-blue-400">AI Reasoning</span> with <span class="text-emerald-400">Universal Execution</span>. An idempotent, self-healing engine that turns silent failures into auditable assets.
        </p>

        <div class="mt-8 flex gap-4">
          <a href="#demo" class="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded transition-all">Live Simulation</a>
          <a href="https://github.com/FabalosDev/foxops-ui" target="_blank" class="px-6 py-3 border border-slate-700 hover:border-slate-500 text-slate-300 font-bold rounded transition-all">View Repository</a>
        </div>
      </div>
    </header>

<section id="executive-summary" class="scroll-mt-32 space-y-6">
        <h2 class="text-2xl font-bold text-white">Executive Summary</h2>
        <p class="text-slate-400 leading-relaxed text-lg">
          FoxOps' Autonomous Self-Healing Infrastructure is an agentic engine that turns silent failures into auditable assets.
          It uses <strong>Make.com</strong> as a Serverless MCP Host to give Gemini 2.0 direct control over industrial infrastructure, executing fixes and generating forensic reports without human intervention.
        </p>
        <div class="p-6 rounded-xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Objective</div>
            <div class="text-white font-medium">Autonomous Remediation</div>
          </div>
          <div>
            <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Engine</div>
            <div class="text-white font-medium">Gemini 2.0 + Vector Search</div>
          </div>
          <div>
            <div class="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Output</div>
            <div class="text-white font-medium">Forensic HTML Reports</div>
          </div>
        </div>
      </section>

    <section id="universal-intelligence" class="scroll-mt-32 space-y-6">
      <h2 class="text-2xl font-bold text-white flex items-center gap-3">
        <Globe class="text-orange-500" /> Universal Error Intelligence
      </h2>
      <p class="text-slate-400">
        FoxOps operates as a central nervous system, utilizing deterministic <strong>AI Signatures</strong> to handle distinct failure classes with a single engine.
      </p>
        <div class="overflow-hidden rounded-xl border border-slate-800">
          <table class="w-full text-left text-sm text-slate-400">
            <thead class="bg-slate-900 text-xs uppercase font-bold text-white">
              <tr>
                <th class="px-6 py-4">Domain</th>
                <th class="px-6 py-4">Error Signature</th>
                <th class="px-6 py-4">Auto-Heal Strategy</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-800 bg-[#0B1121]">
              <tr>
                <td class="px-6 py-4 font-medium text-white">🏭 Industrial</td>
                <td class="px-6 py-4 font-mono text-xs text-rose-400">Servo Overheat (Temp &gt; 85°C)</td>
                <td class="px-6 py-4">Trigger Cool-down &amp; Recalibration SOP</td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-medium text-white">🤖 RPA Bots</td>
                <td class="px-6 py-4 font-mono text-xs text-rose-400">SelectorNotFound / Timeout</td>
                <td class="px-6 py-4">Execute Fallback DOM Logic</td>
              </tr>
              <tr>
                <td class="px-6 py-4 font-medium text-white">☁️ DevOps</td>
                <td class="px-6 py-4 font-mono text-xs text-rose-400">OOM Kill / 503 Unavailable</td>
                <td class="px-6 py-4">Restart Service / Scale Pods</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

    <section id="problem-statement" class="scroll-mt-32 space-y-12 border-b border-slate-800 pb-20">
      <h2 class="text-2xl font-bold text-white flex items-center gap-3"><ShieldCheck class="text-orange-500" /> The Downtime Gap</h2>
      <div class="grid lg:grid-cols-2 gap-16">
        <div>
          <h2 class="text-xs font-bold text-rose-400 mb-4 font-mono tracking-widest uppercase">The Problem</h2>
          <h3 class="text-3xl text-white font-bold mb-6">The "Black Hole" of Downtime</h3>
          <p class="text-slate-400 mb-6 leading-relaxed">In industrial automation, downtime costs <strong>$10k/minute</strong>. When a technician fixes a sensor but doesn't log it, that knowledge is lost forever.</p>
          <ul class="space-y-3 mb-8">
            <li class="flex items-start gap-3 text-slate-300"><span class="text-rose-500 mt-1">✕</span> Ghost Errors (No logs, no history)</li>
            <li class="flex items-start gap-3 text-slate-300"><span class="text-rose-500 mt-1">✕</span> Human Bottlenecks at 3 AM</li>
            <li class="flex items-start gap-3 text-slate-300"><span class="text-rose-500 mt-1">✕</span> Fragile JSON handling in legacy systems</li>
          </ul>
          <div class="bg-rose-500/5 border border-rose-500/10 p-4 rounded-lg text-rose-200 text-xs font-mono leading-loose">
            > CRITICAL_ALERT: Valve_Stiction_Detected<br>> HUMAN_RESPONSE_TIME: 45 Minutes<br>> REVENUE_LOST: $450,000
          </div>
        </div>
        <div>
          <h2 class="text-xs font-bold text-emerald-400 mb-4 font-mono tracking-widest uppercase">The FoxOps Solution</h2>
          <h3 class="text-3xl text-white font-bold mb-6">If it's not documented, it didn't happen.</h3>
          <p class="text-slate-400 mb-6 leading-relaxed">We built a "Senior Architect" engine that doesn't just fix the machine—it writes the paperwork. FoxOps detects, analyzes, and heals itself before a human is even notified.</p>
          <ul class="space-y-4">
            <li class="flex items-start gap-3 text-slate-300">
              <div class="mt-1 h-5 w-5 rounded bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500">✓</div>
              <div><b class="text-white">Self-Healing:</b> <span class="block text-sm text-slate-400">Vector-matched SOP execution via Supabase.</span></div>
            </li>
            <li class="flex items-start gap-3 text-slate-300">
              <div class="mt-1 h-5 w-5 rounded bg-blue-500/10 flex items-center justify-center border border-blue-500/20 text-blue-500">✓</div>
              <div><b class="text-white">Teaching:</b> <span class="block text-sm text-slate-400">Gemini drafts new SOPs for unknown errors.</span></div>
            </li>
            <li class="flex items-start gap-3 text-slate-300">
              <div class="mt-1 h-5 w-5 rounded bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-500">✓</div>
              <div><b class="text-white">Forensics:</b> <span class="block text-sm text-slate-400">Automated HTML/PDF Post-Mortem reports.</span></div>
            </li>
          </ul>
          <div class="mt-8 flex items-center gap-2 text-emerald-400 font-mono text-xs"><span class="animate-pulse">●</span> FOXOPS_RESPONSE_TIME: 1.2s</div>
        </div>
      </div>
    </section>

    <section id="architecture" class="scroll-mt-32 space-y-8">
      <h2 class="text-2xl font-bold text-white flex items-center gap-3"><Network class="text-orange-500" /> Architecture & Stack</h2>
      <p class="text-slate-400">The system operates on a 4-Lane Framework, utilizing <strong>Supabase</strong> as the "Hard Drive" for knowledge (SOPs) and <strong>Make</strong> as the "Motherboard" for orchestration.</p>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div class="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center"><div class="font-bold text-white mb-1">Make</div><div class="text-xs text-slate-500">Orchestration</div></div>
        <div class="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center"><div class="font-bold text-white mb-1">Supabase</div><div class="text-xs text-slate-500">Vector DB</div></div>
        <div class="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center"><div class="font-bold text-white mb-1">Gemini</div><div class="text-xs text-slate-500">Reasoning Core</div></div>
        <div class="p-4 bg-slate-900 rounded-lg border border-slate-800 text-center"><div class="font-bold text-white mb-1">SvelteKit</div><div class="text-xs text-slate-500">Interface</div></div>
      </div>
      <div class="relative rounded-xl bg-[#0B1121] border border-slate-800 shadow-2xl shadow-black/80 overflow-hidden ring-1 ring-white/5">
        <div class="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/5 backdrop-blur-sm">
          <div class="flex items-center gap-2"><div class="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div><span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">System Architecture v1.0</span></div>
          <div class="flex gap-1.5 opacity-50"><div class="h-1.5 w-1.5 rounded-full bg-slate-600"></div><div class="h-1.5 w-1.5 rounded-full bg-slate-600"></div><div class="h-1.5 w-1.5 rounded-full bg-slate-600"></div></div>
        </div>
        <div class="relative p-4 lg:p-10 flex items-center justify-center bg-[#0F172A] overflow-hidden">
          <div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20 pointer-events-none"></div>
          <img src="/flowchartv3.svg" alt="FoxOps Architecture Flowchart" class="relative z-10 w-full h-auto max-w-5xl rounded-lg shadow-lg filter invert brightness-125 contrast-125 opacity-90" />
        </div>
        <div class="px-4 py-2 bg-[#050505] border-t border-white/5 text-[9px] font-mono text-slate-600 flex justify-between"><span>SOURCE: Chart is crafted in Mermaid.js</span><span>RENDER: Vectorscope (Inverted)</span></div>
      </div>
    </section>

    <section id="ingestion" class="scroll-mt-32 space-y-6">
      <h2 class="text-2xl font-bold text-white flex items-center gap-3">
        <Layers class="text-orange-500" /> 4-Layer "Omnichannel" Ingestion
      </h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="p-4 bg-slate-900 rounded-lg border border-slate-800">
          <div class="flex items-center gap-2 mb-2 text-blue-400">
            <Users size={18} /> <span class="text-xs font-bold uppercase">Human Layer</span>
          </div>
          <div class="font-bold text-white text-lg">Support Portal</div>
            <p class="text-xs text-slate-500 mt-1">Operator reports "Vibration" via UI.</p>
        </div>
        <div class="p-4 bg-slate-900 rounded-lg border border-slate-800">
            <div class="flex items-center gap-2 mb-2 text-purple-400">
              <Workflow size={18} /> <span class="text-xs font-bold uppercase">Logic Layer</span>
            </div>
            <div class="font-bold text-white text-lg">Workflow Handler</div>
              <p class="text-xs text-slate-500 mt-1">Make scenario fails (API 429).</p>
            </div>
            <div class="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <div class="flex items-center gap-2 mb-2 text-orange-400">
                <Cpu size={18} /> <span class="text-xs font-bold uppercase">Physical Layer</span>
              </div>
            <div class="font-bold text-white text-lg">IoT Sensors</div>
              <p class="text-xs text-slate-500 mt-1">Festo Pressure &lt; 4.0 bar.</p>
            </div>
            <div class="p-4 bg-slate-900 rounded-lg border border-slate-800">
              <div class="flex items-center gap-2 mb-2 text-emerald-400">
                <Activity size={18} /> <span class="text-xs font-bold uppercase">Vital Layer</span>
              </div>
              <div class="font-bold text-white text-lg">Health Pings</div>
                <p class="text-xs text-slate-500 mt-1">Cron job detects Latency > 200ms.</p>
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
          We utilize a tri-fold database structure: <strong>Incidents</strong> for high-velocity ingestion, <strong>SOPs</strong> for vector retention, and <strong>Tickets</strong> for human workflow.
        </p>

        <div class="space-y-4">

          <div class="border border-slate-800 rounded-lg overflow-hidden">
            <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 font-mono text-sm font-bold text-white flex justify-between items-center">
              <span>table: incidents (The "Live Stream")</span>
              <span class="text-[10px] text-emerald-400 uppercase tracking-wider">High Velocity</span>
            </div>
            <div class="p-4 bg-[#0B1121] text-xs font-mono text-slate-400 space-y-2">
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">id</span> <span>uuid (PK)</span></div>
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">raw_payload</span> <span>jsonb</span></div>
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">status</span> <span>varchar (active, resolved)</span></div>
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">priority</span> <span>varchar (critical, low)</span></div>
              <div class="flex justify-between"><span class="text-blue-400">sop_match_id</span> <span>uuid (FK: sops.id)</span></div>
            </div>
          </div>

          <div class="border border-slate-800 rounded-lg overflow-hidden">
            <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 font-mono text-sm font-bold text-white flex justify-between items-center">
              <span>table: sops (The "Hard Drive")</span>
              <span class="text-[10px] text-purple-400 uppercase tracking-wider">Vector Store</span>
            </div>
            <div class="p-4 bg-[#0B1121] text-xs font-mono text-slate-400 space-y-2">
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">id</span> <span>uuid (PK)</span></div>
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">embedding</span> <span>vector(1536)</span></div>
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">title</span> <span>text</span></div>
              <div class="flex justify-between"><span class="text-blue-400">workflow_description</span> <span>text (Context)</span></div>
            </div>
          </div>

          <div class="border border-slate-800 rounded-lg overflow-hidden">
            <div class="bg-slate-900 px-4 py-2 border-b border-slate-800 font-mono text-sm font-bold text-white flex justify-between items-center">
              <span>table: support_tickets (The "Human Queue")</span>
              <span class="text-[10px] text-orange-400 uppercase tracking-wider">Manual Ops</span>
            </div>
            <div class="p-4 bg-[#0B1121] text-xs font-mono text-slate-400 space-y-2">
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">ticket_id</span> <span>uuid (PK)</span></div>
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">incident_id</span> <span>uuid (FK: incidents.id)</span></div>
              <div class="flex justify-between border-b border-white/5 pb-1"><span class="text-blue-400">assigned_technician</span> <span>text</span></div>
              <div class="flex justify-between"><span class="text-blue-400">resolution_notes</span> <span>text</span></div>
            </div>
          </div>

        </div>
      </section>

      <section id="rpa-case" class="scroll-mt-32 space-y-6">
        <div class="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-8">
          <div class="flex items-start justify-between">
            <div>
              <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-xs font-mono text-blue-400 mb-4">
                <Terminal size={12} /> REAL-WORLD USE CASE
              </div>
              <h3 class="text-2xl font-bold text-white mb-2">Self-Healing RPA Bots</h3>
              <p class="text-slate-400 max-w-xl">
                When a vendor changes a button ID, RPA bots crash. FoxOps detects the <code class="bg-black/30 px-1 py-0.5 rounded text-rose-400">ElementNotFound</code> error, matches it to a fallback SOP, and injects a new XPath selector in real-time.
              </p>
            </div>
            <div class="hidden lg:block text-right">
              <div class="text-4xl font-bold text-white">0.8s</div>
              <div class="text-xs text-slate-500 uppercase tracking-widest">Resolution Time</div>
            </div>
          </div>
        </div>
      </section>

    <section id="scenarios" class="scroll-mt-32 space-y-6">
      <h2 class="text-2xl font-bold text-white flex items-center gap-3"><Layers class="text-orange-500" /> Stress Test Scenarios</h2>
      <p class="text-slate-400 max-w-2xl">We configured the Command Deck to inject four distinct classes of failure, testing the system's ability to handle IT, OT, and Security incidents simultaneously.</p>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-orange-500/30 transition-colors group">
          <div class="flex justify-between items-start mb-4"><div class="text-orange-500 text-xs font-bold uppercase tracking-widest border border-orange-500/20 px-2 py-1 rounded bg-orange-500/10">Physical Layer</div><Cpu class="text-slate-600 group-hover:text-orange-500 transition-colors" size={20} /></div>
          <h3 class="text-white font-bold text-lg mb-2">Pneumatic Pressure Drop</h3>
          <p class="text-sm text-slate-400 mb-4 leading-relaxed">Simulates a Festo CP Factory sensor reporting 3.2 bar (below 4.0 threshold). The engine must identify the hardware fault and trigger a "Maintenance Stop" SOP.</p>
          <div class="text-xs font-mono bg-black p-3 rounded text-slate-500 border border-slate-800">> ERR_CODE: P_LOW_CRITICAL_01</div>
        </div>
        <div class="p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-purple-500/30 transition-colors group">
            <div class="flex justify-between items-start mb-4">
                <div class="text-purple-500 text-xs font-bold uppercase tracking-widest border border-purple-500/20 px-2 py-1 rounded bg-purple-500/10">Integration Layer</div>
                <Workflow class="text-slate-600 group-hover:text-purple-500 transition-colors" size={20} />
            </div>
            <h3 class="text-white font-bold text-lg mb-2">API Rate Limit Burst</h3>
            <p class="text-sm text-slate-400 mb-4 leading-relaxed">Floods the system with OpenAI requests to trigger a `429 Too Many Requests`. The engine must catch the error and implement an exponential backoff strategy.</p>
            <div class="text-xs font-mono bg-black p-3 rounded text-slate-500 border border-slate-800">> HTTP 429: RETRY_AFTER_20S</div>
        </div>
        <div class="p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-blue-500/30 transition-colors group">
            <div class="flex justify-between items-start mb-4">
               <div class="text-blue-500 text-xs font-bold uppercase tracking-widest border border-blue-500/20 px-2 py-1 rounded bg-blue-500/10">Security Layer</div>
              <Ticket class="text-slate-600 group-hover:text-blue-500 transition-colors" size={20} />
           </div>
           <h3 class="text-white font-bold text-lg mb-2">Auth Token Expiry</h3>
           <p class="text-sm text-slate-400 mb-4 leading-relaxed">Injects a "403 Forbidden" error during a user password reset flow. Tests the system's ability to distinguish between a hack attempt and a valid support ticket.</p>
           <div class="text-xs font-mono bg-black p-3 rounded text-slate-500 border border-slate-800">> 403_FORBIDDEN_ACCESS</div>
        </div>
        <div class="p-6 rounded-lg bg-slate-900 border border-slate-800 hover:border-emerald-500/30 transition-colors group">
            <div class="flex justify-between items-start mb-4">
               <div class="text-emerald-500 text-xs font-bold uppercase tracking-widest border border-emerald-500/20 px-2 py-1 rounded bg-emerald-500/10">Infra Layer</div>
              <Activity class="text-slate-600 group-hover:text-emerald-500 transition-colors" size={20} />
           </div>
           <h3 class="text-white font-bold text-lg mb-2">Service Availability (503)</h3>
           <p class="text-sm text-slate-400 mb-4 leading-relaxed">Simulates a total outage of the Public API gateway. The engine must route traffic to a fallback node or notify stakeholders immediately.</p>
           <div class="text-xs font-mono bg-black p-3 rounded text-slate-500 border border-slate-800">> 503_SERVICE_UNAVAILABLE</div>
        </div>
      </div>
    </section>

<section id="demo" class="scroll-mt-32 space-y-6 pb-20">
      <h2 class="text-2xl font-bold text-white flex items-center gap-3">
        <PlayCircle class="text-orange-500" /> Evidence
      </h2>
      <div class="aspect-video w-full rounded-xl bg-black border border-slate-800 overflow-hidden shadow-2xl">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/2bkvCClZwSI"
          title="FoxOps Demo"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
    </section>
  </main>
</div>

