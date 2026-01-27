<script>
  // UPDATED: New Webhook URL for the Self-Healing Endpoint
  const webhookUrl = "https://hook.eu2.make.com/h26b91d9pvhe1oywrjofh5khpenyq7rb";

  // UPDATED: Constructing the 'Bundle 1' Payload
  // Note: Using Template Literals (``) for the procedure to preserve formatting.
  const payload = {
    "tenant": {
      "id": "FAB-IND-01",
      "name": "Festo Industrial Plant"
    },
    "user": {
      "email": "demo+festo@fabalos.com"
    },
    "incident": {
      "id": "5b97ed94-0d0a-4852-a20a-dca7fd5ad865",
      "title": "Actuator Cycle Timeout - Station 04",
      "status": "⚡ ACTIVE: SELF-HEALING CYCLE IN PROGRESS",
      "priority": "MEDIUM",
      "raw_error": "> ERROR_CODE: E-2044 // LATENCY_DETECTED: 450ms // COMPONENT: VUVG-L10-B52 // STATE: INCOMPLETE_STROKE // Pneumatic pressure nominal (6.2 bar) but proximity sensor S3 failed to trigger within window.",
      "sop_title": "Troubleshooting Incomplete Pneumatic Stroke on Actuator with Sensor S3",
      "sop_procedure": `Step 1: Apply Lockout/Tagout (LOTO) procedures to isolate all electrical and pneumatic energy sources.
Step 2: Visually inspect the mechanism associated with sensor S3. Check for any obvious mechanical obstructions, jammed parts, or foreign debris preventing full travel.
Step 3: With pressure vented, manually attempt to move the actuator through its full range of motion. If it does not move freely, investigate the mechanical binding.
Step 4: If the mechanism moves freely, inspect proximity sensor S3 for physical damage or misalignment. Ensure it is securely mounted at the correct position to detect the actuator at the end of its stroke.
Step 5: Manually place the actuator at the end-of-stroke position and verify if the diagnostic LED on sensor S3 illuminates. If it does not, test or replace the sensor.
Step 6: If the sensor is functional, inspect the pneumatic lines connected to the VUVG-L10-B52 valve and the associated cylinder for kinks, leaks, or damage. Check the valve's exhaust silencer for blockages, which can cause slow/incomplete return strokes.
Step 7: After removing LOTO, use the manual override on the VUVG-L10-B52 valve to cycle the actuator. If it still fails to complete the stroke, the valve or cylinder seals are likely faulty.
Step 8: Replace the identified faulty component (sensor, valve, or cylinder), then perform a functional test of the cycle to confirm the resolution.`
    }
  };

  let loading = false;
  let status = "";

  async function sendToMainEngine() {
    loading = true;
    status = "Transmitting Simulation Payload...";

    try {
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        status = "✅ Injection Successful: Dashboard updated.";
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