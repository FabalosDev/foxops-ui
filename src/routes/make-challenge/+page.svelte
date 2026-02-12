<script lang="ts">
  import { onMount } from 'svelte';
  import {
    Cpu,
    Zap,
    ShieldCheck,
    Activity,
    ArrowRight,
    CheckCircle2,
    AlertTriangle,
    Terminal,
    Clock,
    DollarSign,
    Play,
    Database,
    Layers,
    Workflow,
    Ticket,
    Users,
    Network,
    Globe,
    PlayCircle,
    ChevronDown,
    ChevronUp,
    Eye,
    Brain,
    FileText,
    TrendingUp,
    BarChart3
  } from 'lucide-svelte';

  // Toggle for Technical Deep Dive
  let showDeepDive = false;

  function toggleDeepDive() {
    showDeepDive = !showDeepDive;
    if (showDeepDive) {
        setTimeout(() => {
            document.getElementById('deep-dive')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    }
  }

  // Navigation Data
  const sections = [
    { id: 'hero', label: 'The Problem', icon: AlertTriangle },
    { id: 'global-impact', label: '$1.5T Market Gap', icon: Globe }, // NEW SECTION
    { id: 'comparison', label: '1.2s Advantage', icon: Zap },
    { id: 'use-cases', label: 'Who Is This For?', icon: Users },
    { id: 'how-it-works', label: 'How It Works', icon: Activity },
    { id: 'deep-dive', label: 'Technical Specs', icon: Terminal },
    { id: 'demo', label: 'Live Evidence', icon: PlayCircle }
  ];

  // Existing Data for Deep Dive
  const logicTools = [
    { name: "verify_downtime", desc: "Checks ping/heartbeat", input: "{ 'target_ip': '...' }", outcome: "Confirmed Offline" },
    { name: "match_sop", desc: "Vector search SOPs", input: "{ 'error': '...' }", outcome: "Found: SOP-09" },
    { name: "execute_remediation", desc: "Fires secure webhook", input: "{ 'action': '...' }", outcome: "Service Restored" },
    { name: "generate_forensics", desc: "Creates PDF report", input: "{ 'incident_id': '...' }", outcome: "Audit Trail Saved" }
  ];

  // Refined "Who It's For" Data
  const industryCases = [
    {
        title: "Global Manufacturing",
        pain: "Unplanned Downtime",
        fix: "Predictive SOPs reduce downtime by 30-50%.",
        icon: "factory"
    },
    {
        title: "Automotive Sector",
        pain: "$22,000 Per Minute Loss",
        fix: "Auto-remediation prevents the 65% cost rise.",
        icon: "car"
    },
    {
        title: "Fortune Global 500",
        pain: "$129M Loss Per Facility",
        fix: "Turn silent failures into auditable assets.",
        icon: "money"
    },
    {
        title: "High-Volume Tech",
        pain: "Hidden Labor Costs",
        fix: "Eliminates idle labor & rush repair fees.",
        icon: "cpu"
    }
  ];

  const toolDefinition = {
    "$schema": "http://json-schema.org/draft-07/schema#",
    "title": "Initiate Triage",
    "required": ["search_query", "priority"],
    "properties": { "search_query": { "type": "string" }, "priority": { "enum": ["LOW", "CRITICAL"] } }
  };
</script>

<div class="min-h-screen bg-[#050914] text-slate-300 font-sans selection:bg-orange-500/30">

  <div class="fixed inset-0 bg-[url('/grid-pattern.svg')] opacity-5 pointer-events-none"></div>

  <div class="max-w-[1600px] mx-auto flex flex-col lg:flex-row">

    <aside class="hidden lg:block w-72 border-r border-white/5 bg-[#0B1121]/50 backdrop-blur-sm h-screen sticky top-0 p-6 z-20 flex flex-col">
         <div class="flex items-center gap-3 mb-8">
            <div class="h-10 w-10 bg-orange-500/10 rounded-xl border border-orange-500/20 flex items-center justify-center">
                <Cpu size={20} class="text-orange-500" />
            </div>
            <div>
                <h1 class="font-bold text-white tracking-tight">FOXOPS</h1>
                <p class="text-[10px] text-slate-500 font-mono uppercase tracking-widest">Global Finalist</p>
            </div>
         </div>

         <nav class="space-y-1 mb-8">
            {#each sections as section}
            <a href="#{section.id}" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                <svelte:component this={section.icon} size={16} />
                {section.label}
            </a>
            {/each}
         </nav>

         <div class="mb-8">
            <h3 class="text-[10px] uppercase font-bold text-slate-600 tracking-widest mb-2 px-3">The Winning Submission</h3>
            <a href="/make-challenge/entry" class="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 transition-all border border-blue-500/20 group">
                <FileText size={16} class="group-hover:scale-110 transition-transform"/>
                View Legacy Documentation
            </a>
            <p class="text-[10px] text-slate-600 px-3 mt-2 leading-tight">
                This is the original technical entry that secured our spot in the Top 6.
            </p>
         </div>

         <div class="mt-auto pt-6 border-t border-white/5">
             <div class="p-3 bg-gradient-to-br from-orange-500/10 to-rose-500/10 border border-orange-500/20 rounded-lg">
                 <div class="flex items-center gap-2 mb-2">
                    <TrendingUp size={14} class="text-orange-400" />
                    <span class="text-[10px] font-bold text-orange-400 uppercase">Rising Costs</span>
                 </div>
                 <p class="text-[11px] text-slate-400 leading-relaxed">
                    Downtime costs have risen <strong class="text-white">65%</strong> in recent years. Unplanned stops are <strong class="text-white">35% more expensive</strong> than planned maintenance.
                 </p>
              </div>
         </div>
    </aside>

    <main class="flex-1 p-6 lg:p-12 relative z-10 overflow-y-auto scroll-smooth">

        <section id="hero" class="max-w-5xl mx-auto mb-20 pt-10 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-emerald-400 text-[10px] font-bold uppercase tracking-widest mb-6 animate-pulse">
                <span class="h-2 w-2 rounded-full bg-emerald-500"></span> Official Make.com Finalist Selection
            </div>

            <h1 class="text-5xl lg:text-7xl font-black text-white leading-[0.9] mb-6 tracking-tight">
                Stop Losing <br class="hidden lg:block"/>
                <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-rose-600">$129 Million</span> Per Year.
            </h1>

            <p class="text-xl text-slate-400 leading-relaxed max-w-2xl mb-10 lg:mx-0 mx-auto">
                Unplanned downtime costs Fortune Global 500 companies <span class="text-white font-bold">$129M per facility</span> annually. FoxOps stops the bleeding in <span class="text-white font-bold bg-white/10 px-1 rounded">1.2 seconds</span>.
            </p>

            <div class="flex flex-col sm:flex-row items-center gap-4 mb-16 lg:justify-start justify-center">
                <a href="#demo" class="w-full sm:w-auto bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 group text-lg">
                    <Zap size={22} class="group-hover:text-yellow-300 transition-colors fill-current" /> Watch It Fix a Real Error
                </a>
                <button on:click={toggleDeepDive} class="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 font-bold transition-all flex items-center justify-center gap-2">
                    <Terminal size={20} /> How It Works (Technical)
                </button>
            </div>
        </section>

        <section id="global-impact" class="max-w-5xl mx-auto mb-20">
            <h2 class="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                <Globe class="text-blue-400" /> The Scale of the Crisis
            </h2>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div class="bg-[#0B1121] p-6 rounded-2xl border border-white/5 hover:border-blue-500/30 transition-colors">
                    <div class="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-2">Global Annual Loss</div>
                    <div class="text-4xl font-black text-white mb-2">$1.5 Trillion</div>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        Unplanned downtime costs large global manufacturers roughly <strong>11% of their yearly turnover</strong>.
                    </p>
                </div>

                <div class="bg-[#0B1121] p-6 rounded-2xl border border-white/5 hover:border-orange-500/30 transition-colors">
                    <div class="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-2">Cost Per Facility</div>
                    <div class="text-4xl font-black text-orange-400 mb-2">$129 Million</div>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        For Fortune Global 500 companies, this is the average annual loss <strong>per facility</strong>. Costs have risen 65%.
                    </p>
                </div>

                <div class="bg-[#0B1121] p-6 rounded-2xl border border-white/5 hover:border-rose-500/30 transition-colors">
                    <div class="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-2">Automotive Sector</div>
                    <div class="text-4xl font-black text-rose-500 mb-2">$22,000 / min</div>
                    <p class="text-xs text-slate-400 leading-relaxed">
                        When the line stops, cash burns. Automotive faces costs exceeding <strong>$2 Million per hour</strong>.
                    </p>
                </div>
            </div>

            <div class="p-4 rounded-xl bg-blue-900/10 border border-blue-500/20 flex items-start gap-4">
                <div class="p-2 bg-blue-500/10 rounded-lg shrink-0">
                    <BarChart3 class="text-blue-400" size={20} />
                </div>
                <div>
                    <h4 class="text-sm font-bold text-blue-100 mb-1">The Predictive Advantage</h4>
                    <p class="text-xs text-blue-200/70 leading-relaxed">
                        Implementing predictive maintenance (like FoxOps) can mitigate these costs, with potential reductions in downtime of <strong>30-50%</strong>. Unplanned downtime is <strong>35% more costly</strong> than planned maintenance due to idle labor, rush repairs, and reputation damage.
                    </p>
                </div>
            </div>
        </section>

        <section id="comparison" class="max-w-5xl mx-auto mb-20">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div class="p-8 rounded-3xl bg-[#0B1121] border border-rose-500/20 opacity-90 relative overflow-hidden group">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-rose-500/50"></div>
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-rose-400 flex items-center gap-2">
                            <Clock size={24} /> Reactive
                        </h3>
                        <span class="text-rose-900/20 group-hover:text-rose-500/10 font-black text-6xl transition-colors absolute right-4 top-4 select-none">SLOW</span>
                    </div>
                    <ul class="space-y-5 mb-8 font-mono text-sm text-slate-400">
                        <li class="flex justify-between border-b border-white/5 pb-2"><span>Engineer wakes up</span> <span>5 min</span></li>
                        <li class="flex justify-between border-b border-white/5 pb-2"><span>Investigates logs</span> <span>15 min</span></li>
                        <li class="flex justify-between border-b border-white/5 pb-2"><span>Finds solution</span> <span>10 min</span></li>
                        <li class="flex justify-between border-b border-white/5 pb-2"><span>Implements fix</span> <span>15 min</span></li>
                        <li class="flex justify-between text-white font-bold pt-2 text-lg"><span>TOTAL TIME</span> <span class="text-rose-500">45 MIN</span></li>
                    </ul>
                    <div class="bg-rose-950/30 rounded-xl p-4 text-center border border-rose-500/20">
                        <div class="text-[10px] uppercase text-rose-400 font-bold tracking-widest mb-1">Cost Impact (Auto)</div>
                        <div class="text-2xl font-black text-rose-500">$990,000 LOSS</div>
                    </div>
                </div>

                <div class="p-8 rounded-3xl bg-[#0B1121] border border-emerald-500/40 relative overflow-hidden shadow-2xl shadow-emerald-900/20 scale-[1.02] ring-1 ring-emerald-500/20">
                    <div class="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-xl font-bold text-emerald-400 flex items-center gap-2">
                            <Zap size={24} class="fill-current" /> Predictive
                        </h3>
                        <span class="text-emerald-900/20 font-black text-6xl absolute right-4 top-4 select-none">INSTANT</span>
                    </div>
                    <ul class="space-y-5 mb-8 font-mono text-sm text-slate-300">
                        <li class="flex justify-between border-b border-white/5 pb-2"><span>AI Detects Failure</span> <span>0.1s</span></li>
                        <li class="flex justify-between border-b border-white/5 pb-2"><span>Vector Match SOP</span> <span>0.3s</span></li>
                        <li class="flex justify-between border-b border-white/5 pb-2"><span>Execute Self-Heal</span> <span>0.8s</span></li>
                        <li class="flex justify-between opacity-50 border-b border-white/5 pb-2"><span>Notify Human</span> <span>(Async)</span></li>
                        <li class="flex justify-between text-white font-bold pt-2 text-lg"><span>TOTAL TIME</span> <span class="text-emerald-400">1.2 SEC</span></li>
                    </ul>
                    <div class="bg-emerald-950/30 rounded-xl p-4 text-center border border-emerald-500/20">
                        <div class="text-[10px] uppercase text-emerald-400 font-bold tracking-widest mb-1">Cost Impact</div>
                        <div class="text-2xl font-black text-emerald-400">$0 LOSS</div>
                    </div>
                </div>
            </div>
        </section>

        <section id="use-cases" class="max-w-5xl mx-auto mb-24">
            <h2 class="text-2xl font-bold text-white mb-8 text-center">Is Your Industry at Risk?</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#each industryCases as item}
                <div class="p-6 rounded-2xl bg-slate-900/50 border border-white/5 hover:border-orange-500/40 transition-all group hover:-translate-y-1 duration-300">
                    <div class="flex items-start gap-4">
                        <div class="mt-1 p-2 rounded-lg bg-white/5 group-hover:bg-orange-500/10 transition-colors">
                            {#if item.icon === 'bust'} <Users size={20} class="text-slate-400 group-hover:text-orange-400" /> {/if}
                            {#if item.icon === 'cpu'} <Cpu size={20} class="text-slate-400 group-hover:text-orange-400" /> {/if}
                            {#if item.icon === 'money'} <DollarSign size={20} class="text-slate-400 group-hover:text-orange-400" /> {/if}
                            {#if item.icon === 'factory'} <Activity size={20} class="text-slate-400 group-hover:text-orange-400" /> {/if}
                            {#if item.icon === 'car'} <Zap size={20} class="text-slate-400 group-hover:text-orange-400" /> {/if}
                        </div>
                        <div>
                            <h4 class="font-bold text-white text-lg mb-1">{item.title}</h4>
                            <p class="text-xs text-rose-400 uppercase tracking-widest font-bold mb-2">Pain: {item.pain}</p>
                            <div class="flex items-start gap-2">
                                <CheckCircle2 size={16} class="text-emerald-500 mt-0.5 shrink-0" />
                                <p class="text-sm text-slate-300 leading-snug">{item.fix}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/each}
            </div>
        </section>

        <section id="how-it-works" class="max-w-5xl mx-auto mb-24 py-10 border-y border-white/5">
            <h2 class="text-2xl font-bold text-white mb-12 text-center">The Autonomous Loop</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                <div class="hidden md:block absolute top-8 left-[20%] right-[20%] h-0.5 bg-gradient-to-r from-slate-700 via-orange-500/50 to-emerald-500/50 -z-10"></div>

                <div class="text-center">
                    <div class="h-16 w-16 bg-[#0B1121] border border-slate-700 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl relative z-10">
                        <Eye size={32} class="text-blue-400" />
                    </div>
                    <h3 class="font-bold text-white text-lg mb-2">1. Detect</h3>
                    <p class="text-sm text-slate-400 px-4">AI monitors your logs 24/7. It spots anomalies instantly, distinguishing noise from critical failures.</p>
                </div>
                <div class="text-center">
                    <div class="h-16 w-16 bg-[#0B1121] border border-orange-500/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-orange-500/10 relative z-10">
                        <Brain size={32} class="text-orange-400" />
                    </div>
                    <h3 class="font-bold text-white text-lg mb-2">2. Decide</h3>
                    <p class="text-sm text-slate-400 px-4">Gemini AI consults your Vector Database of SOPs to find the approved fix. No guessing.</p>
                </div>
                <div class="text-center">
                    <div class="h-16 w-16 bg-[#0B1121] border border-emerald-500/50 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-emerald-500/10 relative z-10">
                        <Zap size={32} class="text-emerald-400" />
                    </div>
                    <h3 class="font-bold text-white text-lg mb-2">3. Resolve</h3>
                    <p class="text-sm text-slate-400 px-4">Make.com executes the fix via secure API. The system heals itself and sends you a report.</p>
                </div>
            </div>
        </section>

        <section class="max-w-3xl mx-auto mb-24 text-center">
            <div class="p-1 rounded-2xl bg-gradient-to-r from-orange-500 to-rose-600">
                <div class="bg-[#0B1121] rounded-xl p-8">
                    <h2 class="text-2xl font-bold text-white mb-4">Enough Talk. Break the System.</h2>
                    <p class="text-slate-400 mb-8">We've set up a live sandbox. Inject a real failure (like a Server Crash) and watch FoxOps fix it live.</p>
                    <a href="/" class="inline-flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-200 font-bold py-3 px-8 rounded-lg transition-colors">
                        <PlayCircle size={20} /> Launch Live Simulation
                    </a>
                </div>
            </div>
        </section>

        <section id="deep-dive" class="max-w-5xl mx-auto mb-20 scroll-mt-20">
            <button
                on:click={toggleDeepDive}
                class="w-full flex items-center justify-between p-6 rounded-2xl bg-slate-900/40 border border-slate-800 hover:border-slate-600 hover:bg-slate-900 transition-all group"
            >
                <div class="text-left">
                    <h2 class="text-xl font-bold text-white flex items-center gap-3">
                        <Terminal class="text-slate-500 group-hover:text-orange-400 transition-colors" />
                        Classified Engineering Brief
                    </h2>
                    <p class="text-sm text-slate-500 mt-1">For Judges & Engineers: View Architecture, Schema, and Logic.</p>
                </div>
                <div class={`transition-transform duration-300 ${showDeepDive ? 'rotate-180' : ''}`}>
                    <ChevronDown size={24} class="text-slate-500" />
                </div>
            </button>

            {#if showDeepDive}
            <div class="mt-8 space-y-20 animate-in fade-in slide-in-from-top-4 duration-500 border-l-2 border-slate-800 pl-4 lg:pl-8">

                <div class="space-y-6">
                    <h3 class="text-lg font-bold text-white text-orange-400 uppercase tracking-widest">01. Executive Summary</h3>
                    <p class="text-slate-400 leading-relaxed">
                       FoxOps' Autonomous Self-Healing Infrastructure is an agentic engine that turns silent failures into auditable assets.
                       It uses <strong>Make.com</strong> as a Serverless MCP Host to give Gemini 2.0 direct control over industrial infrastructure.
                    </p>
                </div>

                <div class="space-y-6">
                    <h3 class="text-lg font-bold text-white text-orange-400 uppercase tracking-widest">02. System Architecture</h3>
                    <div class="relative p-1 rounded-xl bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 shadow-2xl overflow-hidden">
                        <img src="/flowchartv3.svg" alt="FoxOps Architecture" class="w-full h-auto rounded-lg filter invert brightness-90 contrast-125 opacity-90 hover:opacity-100 transition-opacity" />
                    </div>
                    <p class="text-xs text-slate-500 font-mono text-center">Figure 1: MCP + Make.com Orchestration Layer</p>
                </div>

                <div class="space-y-6">
                     <h3 class="text-lg font-bold text-white text-orange-400 uppercase tracking-widest">03. MCP Protocol</h3>
                     <p class="text-slate-400">Unlike standard chatbots, FoxOps exposes Make scenarios as <strong>MCP Tools</strong>.</p>
                     <div class="bg-[#0B1121] p-6 rounded-lg border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto">
                        <pre>{JSON.stringify(toolDefinition, null, 2)}</pre>
                     </div>
                </div>

                <div class="space-y-6">
                    <h3 class="text-lg font-bold text-white text-orange-400 uppercase tracking-widest">04. Universal Logic</h3>
                    <div class="overflow-hidden rounded-xl border border-white/10 bg-[#0B1121]">
                        <table class="w-full text-left text-sm text-slate-400">
                            <thead class="bg-slate-900 text-xs uppercase font-bold text-white">
                                <tr>
                                    <th class="p-4">Function</th>
                                    <th class="p-4">Input</th>
                                    <th class="p-4">Outcome</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-white/5">
                                {#each logicTools as tool}
                                <tr>
                                    <td class="p-4 font-mono text-orange-400">{tool.name}</td>
                                    <td class="p-4 font-mono text-xs bg-black/20">{tool.input}</td>
                                    <td class="p-4 text-emerald-400">{tool.outcome}</td>
                                </tr>
                                {/each}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
            {/if}
        </section>

        <section id="demo" class="max-w-4xl mx-auto pb-20 border-t border-white/10 pt-16">
            <div class="text-center mb-10">
                <h2 class="text-3xl font-black text-white mb-4">See It Heal in Real-Time</h2>
                <p class="text-slate-400">No smoke and mirrors. Watch FoxOps detect an incident and fix it before the admin panel even refreshes.</p>
            </div>

            <div class="relative w-full aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-white/10 shadow-2xl group mb-12">
                <div class="absolute inset-0 flex items-center justify-center bg-[#0B1121]">
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
            </div>

            <div class="text-center">
                <a href="/" class="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 px-12 rounded-xl transition-all shadow-lg shadow-emerald-900/30 text-lg">
                    <Activity size={20} /> Access Live Dashboard
                </a>
                <p class="text-xs text-slate-500 mt-4">Restricted Access. Use the 'Auto-Inject' feature on the login screen.</p>
            </div>
        </section>

    </main>
  </div>
</div>