<script>
  const webhookUrl = "https://hook.eu2.make.com/h26b91d9pvhe1oywrjofh5khpenyq7rb";

  const payload = {
    "issue_id": "03ddc835-2d54-4ddf-b43e-49f7e313a8c5",
    "original_query": "> ERROR_CODE: E-2044 // LATENCY_DETECTED: 450ms // COMPONENT: VUVG-L10-B52 // STATE: INCOMPLETE_STROKE // Pneumatic pressure nominal (6.2 bar) but proximity sensor S3 failed to trigger within window.",
    "triage_metadata": {
      "tenant_details": {
        "id": "FAB-IND-01",
        "name": "Festo Industrial Plant",
        "email": "demo+festo@fabalos.com",
        "title": "Actuator Cycle Timeout - Station 04"
      },
      "function_args": {
        "clean_title": "Actuator Cycle Timeout - Station 04",
        "detected_domain": "Industrial",
        "logic_reasoning": "High priority due to production line impact and potential hardware failure. Timeout indicates a critical sensor or actuator malfunction.",
        "search_query": "Pneumatic actuator S3 proximity sensor timeout VUVG-L10-B52",
        "priority": "HIGH"
      },
      "request_id": "66a8d99f-b005-42ce-be37-92bec6f48f04",
      "incident_id": "0fcb82cf-97fb-4d07-8ad4-8ae824b917f2"
    }
  };

  let loading = false;
  let status = "";

  async function sendToMainEngine() {
    loading = true;
    status = "Transmitting to Engine Room...";

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        status = "✅ Injection Successful: SOP Match Triggered.";
      } else {
        status = "❌ Engine Error: " + response.statusText;
      }
    } catch (err) {
      status = "❌ Connection Failed: " + err.message;
    } finally {
      loading = false;
    }
  }
</script>

<div class="p-8 flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white">
  <h1 class="text-2xl font-bold mb-4">FoxOps Teaching Terminal</h1>

  <div class="bg-slate-800 p-6 rounded-lg border border-slate-700 shadow-xl max-w-md w-full">
    <p class="text-sm text-slate-400 mb-4 font-mono">Payload: E-2044 / Festo Industrial</p>

    <button
      on:click={sendToMainEngine}
      disabled={loading}
      class="w-full py-3 px-6 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-600 rounded font-bold transition-all uppercase tracking-widest"
    >
      {#if loading} Processing... {:else} Inject to Main Engine {/if}
    </button>

    {#if status}
      <p class="mt-4 text-xs font-mono text-center {status.includes('✅') ? 'text-green-400' : 'text-red-400'}">
        {status}
      </p>
    {/if}
  </div>
</div>