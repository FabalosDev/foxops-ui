<script lang="ts">
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { Ticket, Clock, AlertTriangle, CheckCircle2, Bot, AlertOctagon, User, Copy, Check } from 'lucide-svelte';

  // --- STATE ---
  let tickets: any[] = [];
  let isLoading = true;
  let copiedId: string | null = null; // Para sa visual feedback ng copy

  // --- HELPERS ---
  function getStatusStyle(status: string) {
    const s = status ? status.toUpperCase() : 'UNKNOWN';
    switch (s) {
      case 'OPEN': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'IN_PROGRESS': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'RESOLVED': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  }

  function getPriorityColor(level: string) {
      const p = level ? level.toUpperCase() : 'LOW';
      if (p === 'CRITICAL') return 'text-rose-500 animate-pulse';
      if (p === 'HIGH') return 'text-orange-500';
      if (p === 'MEDIUM') return 'text-amber-400';
      return 'text-slate-500';
  }

  // --- ACTIONS ---
  async function copySopId(id: string) {
      if (!id) return;
      try {
          await navigator.clipboard.writeText(id);
          copiedId = id;
          // Reset icon after 2 seconds
          setTimeout(() => copiedId = null, 2000);
      } catch (err) {
          console.error('Failed to copy:', err);
      }
  }

  async function fetchTickets() {
    isLoading = true;
    const { data, error } = await supabase
        .from('support_tickets')
        .select('id, ticket_title, priority_level, sop_match_id, status, created_at, user_name, raw_error')
        .order('created_at', { ascending: false })
        .limit(20);

    if (error) {
        console.error("Error fetching tickets:", error);
    } else {
        tickets = data || [];
    }
    isLoading = false;
  }

  onMount(async () => {
    await fetchTickets();
  });
</script>

<div class="bg-[#0B1121] border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full min-h-[400px]">

  <div class="p-4 border-b border-white/5 flex justify-between items-center bg-[#080c17]">
     <div class="flex items-center gap-3">
         <div class="p-1.5 bg-blue-500/10 rounded border border-blue-500/20">
             <Ticket size={16} class="text-blue-400" />
         </div>
         <div>
            <h2 class="text-sm font-bold text-white uppercase tracking-widest leading-none">Support Matrix</h2>
            <p class="text-[10px] text-slate-500 font-mono mt-1">INBOUND REQUESTS</p>
         </div>
     </div>
     <div class="text-[10px] font-mono text-slate-400 border border-white/5 px-2 py-1 rounded">
        {tickets.length} ACTIVE
     </div>
  </div>

  <div class="overflow-x-auto flex-1 w-full scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest sticky top-0 backdrop-blur-sm bg-[#0B1121]/90 z-10">
          <th class="p-4 w-12 text-center">Pri</th>
          <th class="p-4">Ticket Details & Automation</th>
          <th class="p-4 w-28">Status</th>
          <th class="p-4 text-right w-24">Age</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5 text-sm">
        {#if tickets.length === 0}
            <tr>
                <td colspan="4" class="p-12 text-center text-slate-600 font-mono text-xs">
                    No active tickets found.
                </td>
            </tr>
        {:else}
            {#each tickets as ticket}
            <tr class="hover:bg-white/5 transition-colors group cursor-pointer border-l-2 border-transparent hover:border-blue-500">

                <td class="p-4 text-center align-top pt-5">
                    <div class={getPriorityColor(ticket.priority_level)} title={ticket.priority_level}>
                        {#if ticket.priority_level === 'CRITICAL'}
                            <AlertOctagon size={16} />
                        {:else if ticket.priority_level === 'HIGH'}
                            <AlertTriangle size={16} />
                        {:else}
                            <CheckCircle2 size={16} />
                        {/if}
                    </div>
                </td>

                <td class="p-4">
                    <div class="flex flex-col gap-2">
                        <span class="font-bold text-slate-200 group-hover:text-blue-400 transition-colors text-sm">
                            {ticket.ticket_title || 'Untitled Request'}
                        </span>

                        <div class="flex flex-wrap items-center gap-2">
                            {#if ticket.sop_match_id}
                                <button
                                    on:click|stopPropagation={() => copySopId(ticket.sop_match_id)}
                                    class="group/btn inline-flex items-center gap-1.5 px-2 py-1 rounded bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/30 hover:border-purple-400 text-[10px] font-bold uppercase tracking-wider shadow-[0_0_10px_rgba(168,85,247,0.2)] transition-all cursor-pointer"
                                    title="Click to Copy SOP ID: {ticket.sop_match_id}"
                                >
                                    {#if copiedId === ticket.sop_match_id}
                                        <Check size={12} class="text-emerald-400" />
                                        <span class="text-emerald-400">COPIED!</span>
                                    {:else}
                                        <Bot size={12} class="text-purple-300" />
                                        <span class="text-purple-300">AUTO-MATCH</span>
                                        <Copy size={10} class="text-purple-400 opacity-50 group-hover/btn:opacity-100" />
                                    {/if}
                                </button>
                            {:else}
                                <div class="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-slate-800 text-slate-500 border border-white/5 text-[10px] font-bold uppercase tracking-wider">
                                    <User size={12} /> Manual
                                </div>
                            {/if}
                        </div>

                        {#if ticket.raw_error}
                            <p class="text-[10px] font-mono text-slate-500 truncate max-w-[200px] opacity-70">
                                > {ticket.raw_error}
                            </p>
                        {/if}
                    </div>
                </td>

                <td class="p-4 align-top pt-4">
                    <span class={`inline-flex px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wider ${getStatusStyle(ticket.status)}`}>
                        {ticket.status || 'OPEN'}
                    </span>
                </td>

                <td class="p-4 text-right align-top pt-4 text-[10px] font-mono text-slate-600">
                     {new Date(ticket.created_at).toLocaleDateString()}
                </td>
            </tr>
            {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>