<script lang="ts">
  import { onMount } from 'svelte';
  import { Lock, ArrowRight } from 'lucide-svelte';
  import { fade } from 'svelte/transition';

  // Svelte 5 Props: Accept children as a snippet
  let { children } = $props();

  // Svelte 5 State: Runes
  let accessGranted = $state(false);
  let code = $state("");
  let error = $state(false);
  let checking = $state(true);

  // The Secret Code
  const SECRET = "foxops";

  onMount(() => {
    const stored = localStorage.getItem("foxops_access");
    if (stored === "true") {
      accessGranted = true;
    }
    checking = false;
  });

  function unlock() {
    if (code.toLowerCase() === SECRET) {
      localStorage.setItem("foxops_access", "true");
      accessGranted = true;
    } else {
      error = true;
      setTimeout(() => error = false, 1000);
    }
  }
</script>

{#if checking}
  <div class="fixed inset-0 bg-[#0B1121] z-[100]"></div>

{:else if !accessGranted}
  <div class="fixed inset-0 bg-[#0B1121] z-[90] flex items-center justify-center p-6" transition:fade>
    <div class="w-full max-w-md">

      <div class="text-center mb-8">
        <div class="h-16 w-16 mx-auto bg-orange-500/10 rounded-2xl flex items-center justify-center border border-orange-500/20 mb-4">
          <Lock size={32} class="text-orange-500" />
        </div>
        <h1 class="text-2xl font-bold text-white mb-2">Restricted Access</h1>
        <p class="text-slate-500 text-sm">FoxOps Automation Environment</p>
      </div>

      <form on:submit|preventDefault={unlock} class="space-y-4">
        <div>
          <input
            type="password"
            bind:value={code}
            placeholder="Enter Access Code..."
            class="w-full bg-slate-900 border {error ? 'border-rose-500' : 'border-slate-700'} p-4 rounded-xl text-center text-white font-mono text-lg focus:outline-none focus:border-orange-500 transition-all placeholder:text-slate-600"
          />
          {#if error}
            <p class="text-rose-500 text-xs text-center mt-2 animate-pulse">Access Denied: Invalid Credentials</p>
          {/if}
        </div>

        <button
          type="submit"
          class="w-full py-4 bg-orange-600 hover:bg-orange-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2"
        >
          Authenticate <ArrowRight size={18} />
        </button>

        <p class="text-center text-[10px] text-slate-600 uppercase tracking-widest mt-6">
          Authorized Personnel Only
        </p>
      </form>

    </div>
  </div>

{:else}
  {@render children()}
{/if}