<script>
  // Simulation of 3 distinct company profiles
// Simulation of 3 distinct company profiles
  const tenants = [
    {
      id: 'FAB-IND-01',
      name: 'Festo Industrial Plant',
      type: 'Mechatronics',
      contact_email: 'demo+festo@fabalos.com' // <--- Replace with your real testing email
    },
    {
      id: 'FAB-SFT-02',
      name: 'SvelteSoft Solutions',
      type: 'Software/SaaS',
      contact_email: 'demo+sveltesoft@fabalos.com'
    },
    {
      id: 'FAB-AGR-03',
      name: 'AgriFlow Automation',
      type: 'Agriculture/IoT',
      contact_email: 'demo+agriflow@fabalos.com'
    }
  ];

  let clientId = tenants[0].id; // Default to first company
  let ticketTitle = "";
  let rawError = "";
  let status = "idle";

  async function submitTicket() {
    status = "loading";
    const webhookUrl = "https://hook.eu2.make.com/b9a1nrhy9osjo749t8g0c1mcnkoostxk";

  const payload = {
      tenant_id: clientId,
      tenant_name: tenants.find(t => t.id === clientId).name,
      user_email: tenants.find(t => t.id === clientId).contact_email, // <--- The Fix
      ticket_title: ticketTitle,
      raw_error: rawError,
      request_id: crypto.randomUUID()
    };

    try {
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        status = "success";
        ticketTitle = ""; rawError = "";
        setTimeout(() => { status = "idle" }, 3000);
      } else {
        status = "error";
      }
    } catch (err) { status = "error"; }
  }
</script>

<div class="min-h-screen bg-slate-900 text-slate-100 p-8 font-mono">
  <div class="max-w-2xl mx-auto border border-blue-500/30 p-6 bg-slate-800 shadow-2xl">

    <div class="mb-8 p-4 bg-slate-900 border border-slate-700 rounded">
      <label class="block text-[10px] uppercase text-blue-400 mb-2 font-bold">Select Active Tenant (Simulation)</label>
      <select bind:value={clientId} class="w-full bg-slate-800 border border-slate-600 p-2 text-sm focus:border-blue-500 outline-none">
        {#each tenants as tenant}
          <option value={tenant.id}>{tenant.name} ({tenant.type})</option>
        {/each}
      </select>
    </div>

    <form on:submit|preventDefault={submitTicket} class="space-y-6">
      <div class="flex justify-between items-center border-b border-slate-700 pb-2">
        <h1 class="text-xl font-bold text-slate-200">INCIDENT_REPORT</h1>
        <span class="text-[10px] text-blue-500">ID: {clientId}</span>
      </div>

      <div>
        <label class="block text-xs uppercase text-slate-400 mb-2">Subject</label>
        <input bind:value={ticketTitle} type="text" required class="w-full bg-slate-900 border border-slate-700 p-3 focus:border-blue-500 outline-none" />
      </div>

      <div>
        <label class="block text-xs uppercase text-slate-400 mb-2">Diagnostic Data</label>
        <textarea bind:value={rawError} required rows="5" class="w-full bg-slate-900 border border-slate-700 p-3 focus:border-blue-500 outline-none"></textarea>
      </div>

      <button type="submit" class="w-full bg-blue-600 hover:bg-blue-500 py-4 font-bold uppercase tracking-widest transition">
        {status === 'loading' ? 'TRIAGING...' : 'SEND TO FOXOPS'}
      </button>

      {#if status === 'success'}
        <p class="text-center text-green-400 text-xs mt-4 animate-pulse">REPORT_LOGGED_SUCCESSFULLY</p>
      {/if}
    </form>
  </div>
</div>