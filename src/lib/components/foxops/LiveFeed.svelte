<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { Activity, CheckCircle2, ShieldAlert, UserCheck, Send, Loader2, BookOpen, User, FileText } from 'lucide-svelte';

  export let incidents: any[] = [];
  const dispatch = createEventDispatcher();

  // DEBUG LOG
  $: console.log("LiveFeed Data:", incidents);

  // --- STATE ---
  let availableSops: any[] = [];
  let selectedSop = "none";
  let newSopTitle = "";
  let newSopContent = "";
  let technicianName = "Senior Systems Architect";

  // --- REPORTING STATE ---
  let resolvingId: string | null = null;
  let resolvingTicketId: string | null = null; // ✅ MOVED UP: Para safe!
  let resolutionNotes = "";
  let isReporting = false;

  // --- 1. HELPERS ---
  function getStatusColor(status: string) {
    if (!status) return 'text-slate-500';
    if (status.includes('MANUAL_OVERRIDE')) return 'text-purple-400 border-purple-500/30 bg-purple-500/10';
    if (status.includes('RESOLVED') || status.includes('HEALED')) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (status.includes('CRITICAL') || status.includes('ESCALATED')) return 'text-rose-400 border-rose-500/30 bg-rose-500/10 animate-pulse';
    return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
  }

  function formatStatus(status: string) {
    if (!status) return 'UNKNOWN';
    if (status.includes('MANUAL_OVERRIDE')) return 'MANUAL OVERRIDE';
    return status.replace('⚡', '').replace('✅', '').split(':')[0].trim();
  }

  // --- 2. HTML GENERATOR (Client-Side) ---
  function generateHtmlReport(data: any) {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const proc = data.sop_content || "No procedure found. Pending engineering review.";
    const safeProcedure = String(proc).replace(/\n/g, '<br>');
    const safeNotes = data.manual_resolution ? String(data.manual_resolution).replace(/\n/g, '<br>') : "No notes provided.";
    const rawError = data.rawError ? String(data.rawError) : "No telemetry.";

    return `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; border: 1px solid #333; background: #fff; max-width: 800px; color: #333;">
        <div style="background-color: #0f172a; padding: 20px; color: #fff; border-bottom: 4px solid #10b981;">
          <h1 style="margin: 0; font-size: 20px; text-transform: uppercase;">INCIDENT RESOLUTION REPORT</h1>
          <p style="margin: 5px 0 0; color: #94a3b8; font-size: 11px;">ID: ${data.incidentId} | ${timestamp}</p>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; background: #f8fafc; font-weight: bold; width: 30%;">TENANT</td>
            <td style="padding: 10px;">${data.tenantName} (${data.tenantId})</td>
          </tr>
          <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 10px; background: #f8fafc; font-weight: bold;">TECHNICIAN</td>
            <td style="padding: 10px; color: #0f172a; font-weight: bold;">${data.technician_name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; background: #f8fafc; font-weight: bold;">SEVERITY</td>
            <td style="padding: 10px; color: #ef4444; font-weight: bold;">${data.priority}</td>
          </tr>
        </table>

        <div style="padding: 20px;">
          <h3 style="color: #64748b; font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px;">Diagnostic Data</h3>
          <pre style="background: #1e293b; color: #e2e8f0; padding: 10px; border-radius: 4px; font-size: 11px; overflow-x: auto;">${rawError}</pre>

          <h3 style="color: #10b981; font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">Technician Resolution</h3>
          <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 10px; border-radius: 4px; font-size: 13px; color: #166534;">
            ${safeNotes}
          </div>

          <h3 style="color: #3b82f6; font-size: 12px; font-weight: bold; text-transform: uppercase; border-bottom: 1px solid #eee; padding-bottom: 5px; margin-top: 20px;">SOP Reference: ${data.sop_title}</h3>
          <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 10px; border-radius: 4px; font-size: 13px; color: #334155;">
            ${safeProcedure}
          </div>
        </div>

        <div style="padding: 10px 20px; background: #f1f5f9; text-align: center; font-size: 10px; color: #94a3b8;">
          Generated via Fabalos Automation Engine
        </div>
      </div>
    `;
  }

  // --- ACTIONS ---
  async function fetchSops() {
      const { data } = await supabase.from('sops').select('id, name, workflow_description').order('name');
      if (data) availableSops = data;
  }

  function openResolveModal(id: string) {
      resolvingId = id;

      // 1. Hanapin ang Incident details
      const incident = incidents.find(i => i.id === id);

      console.log("🎫 DIRECT TICKET ID FROM DB:", incident?.linked_ticket_id);

      // ✅ CAPTURE TICKET ID
      resolvingTicketId = incident?.linked_ticket_id || null;

      // 2. Reset Fields
      newSopTitle = "";
      newSopContent = "";
      resolutionNotes = "";

      // 3. AUTO-SELECT LOGIC
      const aiSuggestedId = incident?.sop_match_id;
      const isSopAvailable = availableSops.some(s => s.id === aiSuggestedId);

      if (aiSuggestedId && isSopAvailable) {
          selectedSop = aiSuggestedId;
          console.log("🤖 AI Auto-matched SOP:", aiSuggestedId);
      } else {
          selectedSop = "none";
      }

      fetchSops();
  }

  async function resolveIncident(id: string) {
    const updatePayload: any = { status: '✅ RESOLVED: MANUAL_OVERRIDE', priority: 'LOW' };
    if (selectedSop !== 'none' && selectedSop !== 'new') updatePayload.resolved_by_sop_id = selectedSop;

    // Optimistic Update
    incidents = incidents.map(i => {
      if (i.id === id) return { ...i, ...updatePayload };
      return i;
    });

    await supabase.from('incidents').update(updatePayload).eq('id', id);
  }

  // ✅ THIS IS THE MASTER FUNCTION (Cleaned & Updated)
  async function triggerFinalReport(incident: any) {
    if (!incident) return;
    isReporting = true;

    const reportWebhook = "https://hook.eu2.make.com/mmqk3qu5dg2eyc1zvjsb6vnuq84kv5g7";

    // SOP LOOKUP LOGIC
    let finalSopTitle = incident.title;
    let finalSopContent = "No standard procedure linked.";

    if (selectedSop === 'new') {
        finalSopTitle = newSopTitle || incident.title;
        finalSopContent = newSopContent;
    } else if (selectedSop !== 'none') {
        const existingSop = availableSops.find(s => s.id === selectedSop);
        if (existingSop) {
            finalSopTitle = existingSop.name;
            finalSopContent = existingSop.workflow_description;
        }
    }

    // PREPARE DATA
    const payloadData = {
      incidentId: incident.id,

      // ✅ VITAL: Add Ticket ID for Make.com
      ticketId: resolvingTicketId,

      ticketTitle: incident.title,
      rawError: incident.error_log,
      status: incident.status,
      priority: incident.priority,
      tenantId: incident.tenant_id || "N/A",
      tenantName: incident.tenant_name || "Unknown Tenant",
      userEmail: incident.user_email || "system@fabalos.com",
      technician_name: technicianName,
      manual_resolution: resolutionNotes,
      sop_action: selectedSop === 'new' ? 'CREATE_NEW' : (selectedSop === 'none' ? 'NONE' : 'LINK_EXISTING'),
      sop_id: selectedSop !== 'new' && selectedSop !== 'none' ? selectedSop : null,
      sop_title: finalSopTitle,
      sop_content: finalSopContent
    };

    // GENERATE HTML
    const htmlString = generateHtmlReport(payloadData);

    // SEND PAYLOAD
    const finalPayload = {
        ...payloadData,
        html_report: htmlString
    };

    try {
      const res = await fetch(reportWebhook, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPayload)
      });

      if (res.ok) {
        await resolveIncident(incident.id);
        resolvingId = null;
      } else {
        alert("Report Failed (Webhook Error)");
      }
    } catch (err) {
      console.error(err);
      alert("Transmission Error");
    } finally {
      isReporting = false;
    }
  }
</script>

<div class="bg-[#0B1121] border border-white/5 rounded-xl overflow-hidden shadow-2xl flex flex-col min-h-[400px] h-full">
  <div class="p-4 border-b border-white/5 flex justify-between items-center bg-[#080c17]">
     <div class="flex items-center gap-2">
         <Activity size={16} class="text-orange-500" />
         <h2 class="text-sm font-bold text-white uppercase tracking-widest">Live Feed ({incidents.length})</h2>
     </div>
     <div class="flex items-center gap-2">
         <span class="relative flex h-2 w-2">
            <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
         </span>
         <span class="text-[10px] font-mono text-slate-500">LISTENING</span>
     </div>
  </div>

  <div class="overflow-x-auto flex-1 w-full">
    <table class="w-full text-left border-collapse">
      <thead>
        <tr class="bg-white/5 border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <th class="p-4">Time</th>
          <th class="p-4">Incident</th>
          <th class="p-4">Status</th>
          <th class="p-4 text-right">Control</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-white/5 text-sm">
        {#if incidents.length === 0}
            <tr>
                <td colspan="4" class="p-12 text-center">
                <div class="flex flex-col items-center gap-3 text-slate-600">
                    <CheckCircle2 size={32} class="opacity-20" />
                    <span class="text-xs font-mono">No active incidents. The floor is quiet.</span>
                </div>
                </td>
            </tr>
        {:else}
            {#each incidents as incident}
            <tr class="hover:bg-white/5 transition-colors group">
                <td class="p-4 font-mono text-xs text-slate-500 whitespace-nowrap">
                {new Date(incident.created_at || incident.generated_at).toLocaleTimeString()}
                </td>
                <td class="p-4">
                <div class="font-medium text-slate-200">{incident.title}</div>
                <div class="text-[10px] text-slate-600 font-mono mt-1">ID: {incident.id?.slice(0, 8)}</div>
                </td>
                <td class="p-4">
                <span class={`inline-flex px-2 py-1 rounded text-[10px] font-bold border uppercase tracking-wide ${getStatusColor(incident.status)}`}>
                    {formatStatus(incident.status)}
                </span>
                </td>
                <td class="p-4 text-right flex justify-end gap-3 items-center">
                <button on:click={() => dispatch('viewLogs', incident)} class="text-xs text-slate-500 hover:text-white underline decoration-slate-700 underline-offset-4">
                    Logs
                </button>

                {#if incident.status && (incident.status.includes('CRITICAL') || incident.status.includes('ESCALATED'))}
                    <button
                    on:click={() => openResolveModal(incident.id)}
                    class="px-3 py-1 bg-rose-600/20 hover:bg-rose-600/40 text-rose-400 border border-rose-500/50 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-2"
                    >
                    <ShieldAlert size={12} /> Resolve
                    </button>
                {:else if incident.status && incident.status.includes('MANUAL_OVERRIDE')}
                    <div class="flex items-center gap-1 text-[10px] text-purple-400 font-bold uppercase tracking-wider">
                        <UserCheck size={12} /> Fixed
                    </div>
                {/if}
                </td>
            </tr>
            {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

{#if resolvingId}
<div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
  <div class="bg-[#0B1121] border border-white/10 w-full max-w-md rounded-xl p-6 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">

    <div class="flex items-center justify-between mb-6">
        <h3 class="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
          <CheckCircle2 size={16} class="text-emerald-500" /> Finalize Resolution
        </h3>
        <button on:click={() => resolvingId = null} class="text-slate-500 hover:text-white text-xs">CLOSE</button>
    </div>

    <div class="mb-4">
        <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
            <User size={12} /> Resolved By
        </label>
        <input
            bind:value={technicianName}
            type="text"
            class="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-white focus:border-emerald-500/50 outline-none font-bold"
        />
    </div>

    <div class="mb-4 bg-white/5 p-3 rounded-lg border border-white/5">
        <label class="text-[10px] text-blue-400 font-bold uppercase mb-2 flex items-center gap-2">
            <BookOpen size={12} /> SOP Link (Standard Procedure)
        </label>
        <select
            bind:value={selectedSop}
            class="w-full bg-black/40 border border-white/10 rounded p-2 text-xs text-slate-300 focus:border-blue-500/50 outline-none mb-2"
        >
            <option value="none" class="text-slate-500">-- No SOP Linked --</option>
            <option value="new" class="text-emerald-400 font-bold">+ Create New SOP</option>
            <optgroup label="Existing Library">
                {#each availableSops as sop}
                    <option value={sop.id}>{sop.name}</option>
                {/each}
            </optgroup>
        </select>

        {#if selectedSop === 'new'}
            <div class="mt-3 space-y-2 animate-in fade-in slide-in-from-top-2">
                <input
                    bind:value={newSopTitle}
                    placeholder="SOP Title"
                    class="w-full bg-emerald-900/20 border border-emerald-500/30 rounded p-2 text-xs text-emerald-100 placeholder-emerald-500/50 focus:outline-none"
                />
                <textarea
                    bind:value={newSopContent}
                    placeholder="Standard Steps..."
                    class="w-full bg-emerald-900/10 border border-emerald-500/20 rounded p-2 text-xs text-emerald-100 placeholder-emerald-500/30 focus:outline-none h-20 resize-none"
                ></textarea>
            </div>
        {/if}
    </div>

    <label class="text-[10px] text-slate-500 font-bold uppercase mb-2 flex items-center gap-2">
        <FileText size={12} /> Incident Notes (What did you do today?)
    </label>
    <textarea
        bind:value={resolutionNotes}
        placeholder="Describe the specific fix..."
        class="w-full bg-black/40 border border-white/10 rounded-lg p-3 text-xs text-slate-200 focus:border-emerald-500/50 outline-none h-24 resize-none mb-4"
    ></textarea>

    <div class="flex justify-end gap-3">
      <button on:click={() => resolvingId = null} class="px-4 py-2 text-xs text-slate-500 hover:text-white uppercase font-bold">Cancel</button>
      <button
        on:click={() => triggerFinalReport(incidents.find(i => i.id === resolvingId))}
        disabled={!resolutionNotes || isReporting}
        class="px-6 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-bold uppercase rounded flex items-center gap-2 disabled:opacity-50 transition-all"
      >
        {#if isReporting}
            <Loader2 size={14} class="animate-spin" /> Processing...
        {:else}
            <Send size={14} /> Submit
        {/if}
      </button>
    </div>
  </div>
</div>
{/if}