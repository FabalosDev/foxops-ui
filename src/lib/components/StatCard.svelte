<script lang="ts">
  let { label, value, icon: Icon, color, logic = "" } = $props();
</script>

<div class="p-5 bg-slate-900/50 border border-white/5 rounded-xl flex flex-col justify-between h-full relative overflow-hidden group hover:bg-white/[0.02] transition-colors">

  <div class="flex items-center justify-between mb-2 z-10">
    <span class="text-[10px] uppercase font-bold text-slate-500 tracking-widest">{label}</span>
    <div class="{color} opacity-80 group-hover:opacity-100 transition-opacity">
      <Icon size={18} />
    </div>
  </div>

  <div class="text-3xl font-black text-white z-10 tabular-nums tracking-tight">
    {value}
  </div>

  {#if logic}
    <div class="text-[9px] text-slate-600 font-mono uppercase border-t border-white/5 pt-2 mt-3 z-10">
       Logic: <span class="text-slate-500">{logic}</span>
    </div>
  {/if}

  <div class="absolute -right-6 -top-6 h-20 w-20 bg-white/5 blur-2xl rounded-full pointer-events-none"></div>
</div>