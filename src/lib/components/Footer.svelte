<script lang="ts">
  import { Github, Terminal, Cpu, Activity } from 'lucide-svelte';

  // 1. Svelte 5 way to receive props (Replaces export let)
  let {
    activeIncidents = [],
    metrics = { totalOps: 0, activeTickets: 0 }
  } = $props();

  const currentYear = new Date().getFullYear();

  // Helper to format numbers (e.g. 1,200)
  const fmt = (n: number) => new Intl.NumberFormat('en-US').format(n);

  const links = {
    platform: [
      { href: '/make-challenge', label: 'Challenge Manifesto' },
      { href: '/support', label: 'Live Ticket System' },
      { href: 'https://fabalos.com', label: 'Fabalos Automation' }
    ]
  };
</script>


<footer class="bg-[#050505] border-t border-white/5 text-slate-400 pt-16 pb-8 font-mono text-xs">
  <div class="max-w-7xl mx-auto px-6">

    <div class="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12">

      <div class="md:col-span-2 space-y-4">
        <div class="flex items-center gap-2 text-white">
          <div class="h-8 w-8 rounded bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Cpu size={18} class="text-orange-500" />
          </div>
          <strong class="text-xl font-bold tracking-tight">FoxOps<span class="text-orange-500">.Engine</span></strong>
        </div>
        <p class="leading-relaxed max-w-sm opacity-60">
          Autonomous Incident Response System. Bridging the gap between Industrial Mechatronics and AI Reasoning.
        </p>
        <div class="flex gap-4 pt-2">
          <a href="https://github.com/FabalosDev" target="_blank" class="hover:text-orange-500 transition-colors"><Github size={18} /></a>
          <div class="px-2 py-0.5 rounded border border-white/10 text-[10px] uppercase tracking-wider text-white/40">
            v1.0.0-beta
          </div>
        </div>
      </div>

      <div class="space-y-4">
        <h4 class="text-white font-bold uppercase tracking-widest text-[10px] opacity-50">Platform</h4>
        <nav class="flex flex-col gap-3">
          {#each links.platform as link}
            <a href={link.href} class="hover:text-orange-500 transition-colors flex items-center gap-2 group">
              <span class="opacity-0 group-hover:opacity-100 text-orange-500 transition-opacity">/</span>
              {link.label}
            </a>
          {/each}
        </nav>
      </div>

      <div class="space-y-4">
        <h4 class="text-white font-bold uppercase tracking-widest text-[10px] opacity-50">Live Telemetry</h4>
        <div class="space-y-2">
          <div class="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
            <span class="flex items-center gap-2 text-white/60 text-[11px] uppercase tracking-wider">
              <Activity size={12} class="text-blue-400"/> Pipeline Volume
            </span>
            <span class="text-white font-mono font-bold">{activeIncidents?.length || 0}</span>
          </div>

          <div class="flex items-center justify-between p-2 rounded bg-white/5 border border-white/5">
            <span class="flex items-center gap-2 text-white/60 text-[11px] uppercase tracking-wider">
              <span class="relative flex h-2 w-2">
                {#if activeIncidents?.filter(i => i.status?.includes('INVESTIGATING') || i.status?.includes('LEARNING')).length > 0}
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
                {:else}
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                {/if}
              </span>
              Engine Status
            </span>

            {#if activeIncidents?.filter(i => i.status?.includes('INVESTIGATING') || i.status?.includes('LEARNING')).length > 0}
              <span class="text-orange-500 font-bold text-[11px] tracking-widest animate-pulse">HEALING...</span>
            {:else}
              <span class="text-emerald-500 font-bold text-[11px] tracking-widest">IDLE</span>
            {/if}
          </div>
        </div>
      </div>
    </div> <div class="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-6 opacity-60">
      <div class="text-[10px] uppercase tracking-widest">
        © {currentYear} Fabalos Automation
      </div>
      <div class="flex items-center gap-6 text-[10px] uppercase tracking-widest">
        <span class="flex items-center gap-2">
          <Terminal size={12} />
          Powered by Make + Gemini
        </span>
      </div>
    </div>
  </div>
</footer>