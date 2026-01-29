<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Footer from '$lib/components/Footer.svelte';

  // 1. Get props from Svelte 5
  let { children, data } = $props();

  // 2. Derive the state so it is reactive to "data" changes
  let incidents = $derived(data?.allIncidents || []);
  let metrics = $derived(data?.metrics || { totalOps: 0, activeTickets: 0 });
  let pipelineVolume = $derived(data?.metrics?.pipelineTotal || 0);
  let allIncidents = $derived(data?.allIncidents || []);
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen bg-[#050505] text-slate-300">
  <main class="flex-1">
    {@render children()}
  </main>

  <Footer
    activeIncidents={incidents}
    metrics={metrics}
  />
</div>