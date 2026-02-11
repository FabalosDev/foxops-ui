<script lang="ts">
  import { supabase } from '$lib/supabaseClient';
  import { goto } from '$app/navigation';
  import { Lock, ArrowRight, Loader2, Cpu, ShieldCheck, Zap } from 'lucide-svelte';

  let email = "";
  let password = "";
  let loading = false;
  let errorMsg = "";

  // The Magic Function: Injects credentials and logs in automatically
  async function injectAndLogin() {
    email = "admin@fabalos.com";
    password = "Make2026foxops";

    // Optional: Add a small delay so they see it fill up (High-tech feel)
    await new Promise(r => setTimeout(r, 300));

    handleLogin();
  }

  async function handleLogin() {
    loading = true;
    errorMsg = "";

    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        errorMsg = error.message;
        loading = false;
    } else {
        goto('/', { invalidateAll: true });
    }
  }
</script>

<div class="min-h-screen bg-[#050914] flex items-center justify-center p-6 relative overflow-hidden font-sans selection:bg-orange-500/30">

    <div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10 pointer-events-none"></div>

    <div class="w-full max-w-sm relative z-10">

        <div class="text-center mb-8">
            <div class="h-12 w-12 mx-auto bg-gradient-to-br from-orange-500 to-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20 mb-4 border border-white/10">
                <Cpu size={24} class="text-white" />
            </div>
            <h1 class="text-xl font-bold text-white tracking-tight">FoxOps Command</h1>
            <p class="text-slate-500 text-xs font-mono uppercase tracking-widest mt-1">Restricted Access</p>
        </div>

        <div class="bg-[#0B1121] border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden">

            <div class="mb-6 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-lg">
                <div class="flex items-start gap-3">
                    <ShieldCheck size={16} class="text-emerald-500 mt-0.5 shrink-0" />
                    <div>
                        <p class="text-[11px] text-emerald-200/80 leading-relaxed font-mono">
                            <span class="font-bold text-emerald-400">Make Challenge Access:</span>
                            Dashboard is open for judges during the evaluation period.
                        </p>
                        <button
                            on:click={injectAndLogin}
                            class="mt-2 text-[10px] bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1.5 rounded-md transition-all flex items-center gap-1.5 group w-full justify-center"
                        >
                            <Zap size={10} class="group-hover:text-yellow-300 transition-colors" />
                            Auto-Inject Credentials
                        </button>
                    </div>
                </div>
            </div>

            <form on:submit|preventDefault={handleLogin} class="space-y-4">
                {#if errorMsg}
                    <div class="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-xs text-center font-bold animate-pulse">
                        {errorMsg}
                    </div>
                {/if}

                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">ID</label>
                    <input
                        bind:value={email}
                        type="email"
                        placeholder="Authorized ID"
                        class="w-full bg-[#050914] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors font-mono"
                    />
                </div>

                <div class="space-y-1">
                    <label class="text-[10px] font-bold text-slate-500 uppercase tracking-wider pl-1">Passkey</label>
                    <input
                        bind:value={password}
                        type="password"
                        placeholder="••••••••"
                        class="w-full bg-[#050914] border border-slate-700 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors font-mono"
                    />
                </div>

                <button
                    disabled={loading}
                    class="w-full bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-orange-900/20 flex items-center justify-center gap-2 text-sm mt-2"
                >
                    {#if loading}
                        <Loader2 size={16} class="animate-spin" /> Authenticating...
                    {:else}
                        <Lock size={16} /> Enter System
                    {/if}
                </button>
            </form>
        </div>

        <div class="mt-8 text-center">
            <a href="/make-challenge" class="text-xs text-slate-600 hover:text-white transition-colors flex items-center justify-center gap-1">
                <ArrowRight size={12} class="rotate-180" /> Abort Sequence
            </a>
        </div>

    </div>
</div>