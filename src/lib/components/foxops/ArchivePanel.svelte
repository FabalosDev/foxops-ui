<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { Archive, FileText, Clock, Search } from 'lucide-svelte';

  export let reports: any[] = [];

  const dispatch = createEventDispatcher();
</script>

<div class="bg-[#0B1121] border border-white/5 rounded-xl p-1 shadow-inner h-full flex flex-col">
  <div class="p-3 border-b border-white/5 flex justify-between items-center mb-1">
    <div class="flex items-center gap-2 text-slate-500 uppercase text-[10px] font-bold tracking-widest">
        <Archive size={14} class="text-blue-500" /> Recent Reports
    </div>
    <span class="text-[9px] font-mono text-slate-600">LAST 24H</span>
  </div>

  <ul class="space-y-1 flex-1 overflow-y-auto">
    {#each reports as report}
      <li>
        <button
          on:click={() => dispatch('openReport', report)}
          class="w-full text-left p-3 rounded-lg hover:bg-white/5 transition-colors group flex items-start gap-3"
        >
          <div class="mt-0.5 p-1.5 bg-slate-800 rounded text-slate-400 group-hover:text-white group-hover:bg-blue-500 transition-all">
            <FileText size={14} />
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-xs font-bold text-slate-300 truncate group-hover:text-white">
                {report.sop_title || report.sop_snapshot_title || 'Unknown Procedure'}
            </p>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] font-mono text-slate-600 flex items-center gap-1">
                <Clock size={8}/> {new Date(report.created_at).toLocaleTimeString()}
              </span>
              <span class="text-slate-700">•</span>
              <span class="text-[10px] text-emerald-500 flex items-center gap-1">Verified</span>
            </div>
          </div>
        </button>
      </li>
    {:else}
       <li class="p-8 text-center text-slate-600 text-xs font-mono">
         Archive is empty.
       </li>
    {/each}
  </ul>

  <div class="p-3 mt-auto border-t border-white/5">
    <button
      on:click={() => dispatch('openVault')}
      class="w-full py-2 border border-white/10 text-slate-400 text-[10px] font-bold uppercase tracking-widest rounded hover:bg-white/5 hover:text-white transition-colors flex items-center justify-center gap-2"
    >
      <Search size={12} /> Open Vault
    </button>
  </div>
</div>