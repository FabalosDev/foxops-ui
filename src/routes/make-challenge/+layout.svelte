<script>
  import '../../app.css';
  import Footer from '$lib/components/Footer.svelte';
  import { Cpu, PlayCircle } from 'lucide-svelte';
</script>

<div class="font-sans text-white selection:bg-orange-500/30">
  <header class="fixed top-0 left-0 w-full z-50 border-b border-slate-800 bg-[#0B1121]/90 backdrop-blur-md transition-all duration-300">
    <div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

    <div class="relative max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

      <div class="flex items-center gap-4">
        <div class="hidden md:flex h-8 w-8 rounded bg-orange-500/10 items-center justify-center border border-orange-500/20">
          <Cpu size={18} class="text-orange-500" />
        </div>
        <div>
          <h1 class="text-sm md:text-lg font-bold tracking-tight text-white leading-tight">
            FoxOps <span class="text-slate-500">Autonomous Infrastructure</span>
          </h1>
          <div class="inline-flex mt-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
            Make Challenge 2026
          </div>
        </div>
      </div>

      <div class="flex items-center gap-4 shrink-0">
        <a href="#demo" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium text-xs rounded-lg transition-all flex items-center gap-2">
          <PlayCircle size={14} /> <span class="hidden sm:inline">Watch Demo</span>
        </a>
        <a href="https://fabalos.com" class="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-all uppercase tracking-wider text-emerald-400">Book Audit</a>
        <a href="/" class="text-xs font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-wider">Login</a>
      </div>
    </div>
  </header>
</div>

<main class="w-full min-h-screen bg-[#050914] text-white pt-24 font-sans p-6">
  <div class="max-w-7xl mx-auto">
      <slot />
  </div>
</main>

<Footer activeIncidents={[]} />