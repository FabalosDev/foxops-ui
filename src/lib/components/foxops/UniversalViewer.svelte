<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { FileText, Terminal, X, Maximize2, Archive } from 'lucide-svelte';

    export let item: any = null;
    export let mode: 'report' | 'log' = 'report';

    const dispatch = createEventDispatcher();

    function close() {
      dispatch('close');
    }

    function openRaw() {
      if (!item) return;
      const content = mode === 'report' ? (item.report_html || '<h1>No Content</h1>') : JSON.stringify(item, null, 2);
      const type = mode === 'report' ? 'text/html' : 'application/json';
      const blob = new Blob([content], { type });
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-12">
    <div class="absolute inset-0 bg-black/90 backdrop-blur-sm transition-opacity" on:click={close}></div>

    <div class="relative bg-[#0B1121] border border-white/10 w-full max-w-4xl h-[85vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

      <div class="flex items-center justify-between p-4 border-b border-white/5 bg-[#080c17]">
        <div class="flex items-center gap-3">
           <div class={`p-2 rounded border transition-colors ${mode === 'report' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
              {#if mode === 'report'}<FileText size={18} />{:else}<Terminal size={18} />{/if}
           </div>
           <div>
              <h2 class="text-sm font-bold text-white uppercase tracking-widest">
                  {mode === 'report' ? (item.sop_used || 'SYSTEM REPORT') : 'INCIDENT LOGS'}
              </h2>
              <div class="flex items-center gap-2 text-[10px] font-mono text-slate-500 mt-0.5">
                 <span>ID: {item.id?.slice(0,8)}</span>
              </div>
           </div>
        </div>
        <button on:click={close} class="p-2 hover:bg-white/5 rounded text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-0 bg-[#0B1121]">
         {#if mode === 'report'}
             <div class="prose prose-invert prose-sm max-w-none p-8">
                 {#if item.report_html}
                    {@html item.report_html}
                 {:else}
                    <div class="flex flex-col items-center justify-center h-full text-slate-600 gap-4 mt-12">
                       <Archive size={48} class="opacity-20" />
                       <p class="font-mono text-sm">No detailed HTML content available.</p>
                    </div>
                 {/if}
             </div>
         {:else}
             <div class="p-6 font-mono text-xs">
                 <pre class="text-emerald-400 bg-black/30 p-4 rounded-lg border border-white/5 overflow-x-auto">{JSON.stringify(item, null, 2)}</pre>
             </div>
         {/if}
      </div>

      <div class="p-4 border-t border-white/5 bg-[#080c17] flex justify-end gap-3">
         <button on:click={close} class="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-white transition-colors">Close Viewer</button>
         <button on:click={openRaw} class="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold uppercase tracking-wider rounded transition-colors flex items-center gap-2"><Maximize2 size={14}/> Open Raw</button>
      </div>
    </div>
</div>