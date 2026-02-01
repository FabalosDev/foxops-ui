<script lang="ts">
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { FileText, Save, X, Edit3, ToggleLeft, ToggleRight, Loader2, Wifi, Globe, ShieldCheck, ShieldAlert } from 'lucide-svelte';

    export let onClose: () => void;

    let sops: any[] = [];
    let loading = true;
    let editingId: string | null = null;
    let saving = false;

    // Editor State
    let editTitle = "";
    let editContent = "";
    let editSelfHealing = false;
    let editVerified = false;
    let editWebhookTrigger = "";

    onMount(async () => {
        await fetchSops();
    });

    async function fetchSops() {
        loading = true;

        const { data, error } = await supabase
            .from('sops')
            .select('*')
            .order('name', { ascending: true });

        if (error) {
            console.error("SUPABASE ERROR:", error.message);
        } else if (data) {
            sops = data.map(s => ({
                id: s.id,
                title: s.name,
                content: s.workflow_description,
                is_self_healing: s.is_self_healing,
                webhook_trigger: s.webhook_trigger,
                verified: s.is_sop_verified // <--- FIXED: Matches your screenshot column
            }));
        }

        loading = false;
    }

    function startEdit(sop: any) {
        editingId = sop.id;
        editTitle = sop.title;
        editContent = sop.content;
        editSelfHealing = sop.is_self_healing;
        editVerified = sop.verified;
        editWebhookTrigger = sop.webhook_trigger || "";
    }

    async function saveEdit() {
        saving = true;

        // Logic: If we are setting it to TRUE, we sign and timestamp it.
        // If FALSE, we clear the signature.
        const updatePayload = {
            name: editTitle,
            workflow_description: editContent,
            is_self_healing: editSelfHealing,
            webhook_trigger: editWebhookTrigger,
            is_sop_verified: editVerified, // <--- FIXED: Column name
            verified_by: editVerified ? 'System Chief Engineer' : null, // Auto-sign
            verified_at: editVerified ? new Date().toISOString() : null // Auto-timestamp
        };

        const { error } = await supabase
            .from('sops')
            .update(updatePayload)
            .eq('id', editingId);

        if (!error) {
            const index = sops.findIndex(s => s.id === editingId);
            if (index !== -1) {
                sops[index] = {
                    ...sops[index],
                    title: editTitle,
                    content: editContent,
                    is_self_healing: editSelfHealing,
                    webhook_trigger: editWebhookTrigger,
                    verified: editVerified
                };
            }
            editingId = null;
        }
        saving = false;
    }
</script>

<div class="fixed inset-0 z-[60] flex items-center justify-center p-4 lg:p-12">
    <div class="absolute inset-0 bg-black/95 backdrop-blur-md" on:click={onClose}></div>

    <div class="relative bg-[#0B1121] border border-white/10 w-full max-w-5xl h-[80vh] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95">

        <div class="flex items-center justify-between p-4 border-b border-white/5 bg-[#080c17]">
            <h2 class="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2">
                <FileText size={16} class="text-blue-500" /> SOP Control Matrix
            </h2>
            <button on:click={onClose} class="text-slate-500 hover:text-white"><X size={20} /></button>
        </div>

        <div class="flex flex-1 overflow-hidden">
            <div class="w-1/3 border-r border-white/5 overflow-y-auto p-2 bg-black/20">
                {#if loading}
                    <div class="p-8 flex justify-center"><Loader2 class="animate-spin text-blue-500" /></div>
                {:else}
                    {#each sops as sop}
                        <button
                            on:click={() => startEdit(sop)}
                            class={`w-full text-left p-3 rounded mb-1 transition-all flex items-center justify-between group ${editingId === sop.id ? 'bg-blue-600/20 border border-blue-500/50 shadow-lg shadow-blue-500/10' : 'hover:bg-white/5 border border-transparent'}`}
                        >
                            <div class="flex items-center gap-2 overflow-hidden">
                                {#if sop.verified}
                                    <ShieldCheck size={12} class="text-emerald-500 shrink-0" />
                                {:else}
                                    <ShieldAlert size={12} class="text-amber-500/50 shrink-0" />
                                {/if}
                                <span class="text-xs font-bold text-slate-300 truncate">{sop.title}</span>
                            </div>

                            <div class="flex gap-1 shrink-0">
                                {#if sop.webhook_trigger}
                                    <Globe size={10} class="text-blue-400" title="Webhook Configured" />
                                {/if}
                                {#if sop.is_self_healing}
                                    <span class="text-[8px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-mono uppercase">Auto</span>
                                {:else}
                                    <span class="text-[8px] bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded font-mono uppercase">Manual</span>
                                {/if}
                            </div>
                        </button>
                    {/each}
                {/if}
            </div>

            <div class="flex-1 p-6 bg-[#0B1121] flex flex-col overflow-y-auto">
                {#if editingId}
                    <div class="flex items-center justify-between mb-6 gap-4">
                        <input bind:value={editTitle} class="bg-transparent text-xl font-bold text-white focus:outline-none w-full border-b border-transparent focus:border-blue-500/50 pb-1" />

                        <div class="flex gap-4 shrink-0">
                            <button on:click={() => editVerified = !editVerified} class="flex flex-col items-end gap-1 group">
                                <span class={`text-[8px] font-mono uppercase tracking-widest ${editVerified ? 'text-emerald-400' : 'text-amber-500'}`}>
                                    {editVerified ? 'Verified & Locked' : 'Unverified Draft'}
                                </span>
                                <div class="flex items-center gap-2">
                                    {#if editVerified}
                                        <ShieldCheck size={16} class="text-emerald-500" />
                                        <ToggleRight class="text-emerald-500" size={32} />
                                    {:else}
                                        <ShieldAlert size={16} class="text-amber-500" />
                                        <ToggleLeft class="text-slate-600 group-hover:text-slate-400" size={32} />
                                    {/if}
                                </div>
                            </button>

                            <button on:click={() => editSelfHealing = !editSelfHealing} class="flex flex-col items-end gap-1">
                                <span class="text-[8px] font-mono uppercase text-slate-500 tracking-widest">Self-Healing</span>
                                <div class="flex items-center gap-2">
                                    {#if editSelfHealing}
                                        <ToggleRight class="text-blue-500" size={32} />
                                    {:else}
                                        <ToggleLeft class="text-slate-600" size={32} />
                                    {/if}
                                </div>
                            </button>
                        </div>
                    </div>

                    <div class="mb-6">
                        <label class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Automation Webhook (Make.com / n8n)</label>
                        <div class="relative">
                            <div class="absolute inset-y-0 left-3 flex items-center pointer-events-none text-blue-500/50">
                                <Wifi size={14} />
                            </div>
                            <input
                                bind:value={editWebhookTrigger}
                                placeholder="https://hook.eu2.make.com/..."
                                class="w-full bg-black/30 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-xs font-mono text-blue-400 focus:border-blue-500/50 focus:outline-none transition-all shadow-inner"
                            />
                        </div>
                    </div>

                    <div class="flex-1 flex flex-col min-h-0">
                        <label class="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2 block">Procedure Steps (Markdown)</label>
                        <textarea
                            bind:value={editContent}
                            class="flex-1 w-full bg-black/30 border border-white/10 rounded-lg p-4 text-sm font-mono text-slate-300 focus:border-blue-500/50 focus:outline-none resize-none leading-relaxed shadow-inner"
                            placeholder="Enter step-by-step remediation protocol..."
                        ></textarea>
                    </div>

                    <div class="mt-6 flex justify-end gap-3">
                        <button on:click={() => editingId = null} class="px-4 py-2 text-slate-500 hover:text-white text-xs uppercase font-bold tracking-widest transition-colors">Cancel</button>
                        <button
                            on:click={saveEdit}
                            disabled={saving}
                            class="px-8 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-widest rounded-lg flex items-center gap-2 shadow-lg shadow-blue-500/10 disabled:opacity-50 transition-all active:scale-95"
                        >
                            {#if saving}
                                <Loader2 size={14} class="animate-spin" /> Committing...
                            {:else}
                                <Save size={14} /> Commit Changes
                            {/if}
                        </button>
                    </div>
                {:else}
                    <div class="h-full flex flex-col items-center justify-center text-slate-600">
                        <div class="p-6 rounded-full bg-white/5 mb-4 border border-white/5">
                            <Edit3 size={48} class="opacity-20" />
                        </div>
                        <p class="font-mono text-sm tracking-tight">Select an SOP to verify or edit procedure</p>
                    </div>
                {/if}
            </div>
        </div>
    </div>
</div>