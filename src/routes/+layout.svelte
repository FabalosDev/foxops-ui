<script lang="ts">
  import './layout.css';
  import favicon from '$lib/assets/favicon.svg';
  import Footer from '$lib/components/Footer.svelte';

  // Get data from +layout.server.ts
  let { children, data } = $props();
</script>

<svelte:head>
  <link rel="icon" href={favicon} />
</svelte:head>

<div class="flex flex-col min-h-screen bg-[#0F172A] text-slate-300">

  <main class="flex-1">
    {@render children()}
  </main>

  <Footer metrics={data.metrics} />

</div>