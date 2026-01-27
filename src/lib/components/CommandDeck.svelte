<script lang="ts">
  import {
    Ticket,
    Workflow,
    Cpu,
    Activity,
    X,
    Play,
    Terminal,
    CheckCircle2,
    AlertTriangle,
    Loader2
  } from 'lucide-svelte';
  import { fade, fly } from 'svelte/transition';

  // --- CONFIGURATION ---
  const MAKE_WEBHOOK_URL = "https://hook.eu2.make.com/b9a1nrhy9osjo749t8g0c1mcnkoostxk";

  // --- DATA: THE 12 SCENARIOS (NORMALIZED) ---
  const scenarios = [
    // --- CATEGORY 1: SUPPORT TICKETS (Blue) ---
    {
      id: 'ticket-login',
      title: 'Support: Login Issue',
      icon: Ticket,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      desc: 'User reports 403 Forbidden on password reset (Low Priority).',
      payload: {
        input: {
          meta: { ref_id: "TKT-2026-881", origin: "foxops_portal", priority: "LOW" },
          identity: { user_email: "sarah.j@logistics-co.com", user_company: "Logistics Co.", user_name: "Sarah Jenkins", user_id: "CLI-LOG-09" },
          incident: {
            title: "Cannot reset password",
            timestamp: new Date().toISOString(),
            raw: "User reports receiving 403 Forbidden when clicking the reset link sent to email. Browser: Chrome 120."
          }
        }
      }
    },
    {
      id: 'ticket-integration',
      title: 'Support: API Error',
      icon: Ticket,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      desc: 'Client staging environment failing schema validation (Medium Priority).',
      payload: {
        input: {
          meta: { ref_id: "TKT-2026-882", origin: "foxops_portal", priority: "MEDIUM" },
          identity: { user_email: "devops@fabricam.com", user_company: "Fabricam Inc.", user_name: "Dave Tech", user_id: "CLI-FAB-22" },
          incident: {
            title: "Webhook endpoints returning 500",
            timestamp: new Date().toISOString(),
            raw: "Our staging environment cannot post to your API. Error message: 'Schema validation failed for field: quantity'."
          }
        }
      }
    },
    {
      id: 'ticket-billing',
      title: 'Support: Billing Critical',
      icon: Ticket,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
      border: 'border-blue-500/20',
      desc: 'Production halted due to false plan expiry (High Priority).',
      payload: {
        input: {
          meta: { ref_id: "TKT-2026-883", origin: "foxops_portal", priority: "HIGH" },
          identity: { user_email: "finance@global-parts.com", user_company: "Global Parts", user_name: "Finance Dept", "user_id": "CLI-GLO-01" },
          incident: {
            title: "URGENT: Subscription Suspended Error",
            timestamp: new Date().toISOString(),
            raw: "Production halted. Dashboard says 'Plan Expired' but payment went through yesterday. Transaction ID: TX-9992."
          }
        }
      }
    },

    // --- CATEGORY 2: WORKFLOW ERRORS (Purple) ---
    {
      id: 'workflow-rate',
      title: 'Workflow: Rate Limit',
      icon: Workflow,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      desc: 'OpenAI 429 Error triggered in Scenario B (High Priority).',
      payload: {
        input: {
          meta: { ref_id: "ERR-MAKE-429", origin: "make_scenario_b", priority: "HIGH" },
          identity: { user_email: "admin@fabalos.com", user_company: "Fabalos Automation", user_name: "Make Bot", user_id: "SYS-MAKE-01" },
          incident: {
            title: "HTTP 429: Rate Limit Exceeded",
            timestamp: new Date().toISOString(),
            raw: "Module: OpenAI GPT-4 // Bundle: 1 // Error: 429 Too Many Requests. Retry-After: 20s. // Scenario ID: 554321."
          }
        }
      }
    },
    {
      id: 'workflow-map',
      title: 'Workflow: Data Mapping',
      icon: Workflow,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      desc: 'Missing variable in JSON parser causing validation fail (Medium Priority).',
      payload: {
        input: {
          meta: { ref_id: "ERR-MAKE-MAP", origin: "make_scenario_a", priority: "MEDIUM" },
          identity: { user_email: "system@fabalos.com", user_company: "Fabalos Internal", user_name: "Data Processor", user_id: "SYS-MAKE-02" },
          incident: {
            title: "Missing Variable in JSON Parser",
            timestamp: new Date().toISOString(),
            raw: "RuntimeError: validation failed. Missing value for required field 'client_id' in bundle 4. Input payload size: 2kb."
          }
        }
      }
    },
    {
      id: 'workflow-timeout',
      title: 'Workflow: Timeout',
      icon: Workflow,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      border: 'border-purple-500/20',
      desc: 'Google Sheets connection timed out after 60s (Low Priority).',
      payload: {
        input: {
          meta: { ref_id: "ERR-MAKE-TIMEOUT", origin: "make_scenario_c", priority: "LOW" },
          identity: { user_email: "logs@fabalos.com", user_company: "Fabalos R&D", user_name: "Webhook Listener", "user_id": "SYS-MAKE-03" },
          incident: {
            title: "Google Sheets Connection Timed Out",
            timestamp: new Date().toISOString(),
            raw: "ConnectionError: The operation timed out after 60000ms. Retrying... Success on attempt 2."
          }
        }
      }
    },

    // --- CATEGORY 3: IOT THRESHOLDS (Orange) ---
    {
      id: 'iot-pressure',
      title: 'IoT: Low Pressure',
      icon: Cpu,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      desc: 'Festo Sensor reporting 3.2 bar (Threshold 4.0) - Critical.',
      payload: {
        input: {
          meta: { ref_id: "IOT-PNU-001", origin: "festo_cp_factory", priority: "CRITICAL" },
          identity: { user_email: "maint+station1@fabalos.com", user_company: "Festo Plant A", user_name: "Station 01 Controller", user_id: "PLC-S01" },
          incident: {
            title: "Pressure Drop Detected - Main Line",
            timestamp: new Date().toISOString(),
            raw: "> ERROR_CODE: P-LOW-01 // SENSOR: BP-102 // VALUE: 3.2 bar // THRESHOLD: 4.0 bar // ACTION: EMERGENCY_STOP // Valve V1 closed."
          }
        }
      }
    },
    {
      id: 'iot-motor',
      title: 'IoT: Motor Overheat',
      icon: Cpu,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      desc: 'Conveyor motor reached 85°C (High Priority).',
      payload: {
        input: {
          meta: { ref_id: "IOT-MTR-099", origin: "festo_cp_factory", priority: "HIGH" },
          identity: { user_email: "maint+station4@fabalos.com", user_company: "Festo Plant B", user_name: "Conveyor Belt 4", user_id: "PLC-S04" },
          incident: {
            title: "Motor Temp Warning",
            timestamp: new Date().toISOString(),
            raw: "> ERROR_CODE: T-HIGH-99 // SENSOR: TM-500 // VALUE: 85°C // STATE: WARNING // RPM: 1200 // Suggested Check: Fan Filter."
          }
        }
      }
    },
    {
      id: 'iot-net',
      title: 'IoT: Heartbeat Loss',
      icon: Cpu,
      color: 'text-orange-400',
      bg: 'bg-orange-500/10',
      border: 'border-orange-500/20',
      desc: 'Gateway missed heartbeat for 300s (Medium Priority).',
      payload: {
        input: {
          meta: { ref_id: "IOT-NET-002", origin: "festo_iot_gateway", priority: "MEDIUM" },
          identity: { user_email: "network@fabalos.com", user_company: "Festo Plant A", user_name: "IoT Gateway", user_id: "GTW-01" },
          incident: {
            title: "Sensor Heartbeat Missed",
            timestamp: new Date().toISOString(),
            raw: "> EVENT: HEARTBEAT_MISS // DEVICE: PROX-S3 // LAST_SEEN: 300s ago // RETRY: Active // Status: Offline."
          }
        }
      }
    },

    // --- CATEGORY 4: HEALTH CHECKS (Emerald) ---
    {
      id: 'health-latency',
      title: 'Health: DB Latency',
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      desc: 'Supabase Read Latency spiked to 850ms (Medium Priority).',
      payload: {
        input: {
          meta: { ref_id: "HLT-DB-LAT", origin: "supabase_watchdog", priority: "MEDIUM" },
          identity: { user_email: "admin@fabalos.com", user_company: "Supabase Infra", user_name: "Health Monitor", user_id: "SYS-DB-01" },
          incident: {
            title: "DB Read Latency > 500ms",
            timestamp: new Date().toISOString(),
            raw: "[WARN] Query execution time: 850ms. Region: sg-1. Active Connections: 45. CPU Load: 78%."
          }
        }
      }
    },
    {
      id: 'health-api',
      title: 'Health: API Down',
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      desc: 'Public API returning 503 Service Unavailable (Critical).',
      payload: {
        input: {
          meta: { ref_id: "HLT-API-DOWN", origin: "uptime_robot", priority: "CRITICAL" },
          identity: { user_email: "oncall@fabalos.com", user_company: "Fabalos Public API", user_name: "Uptime Bot", user_id: "SYS-API-01" },
          incident: {
            title: "API DOWN: https://api.fabalos.com",
            timestamp: new Date().toISOString(),
            raw: "Status: 503 Service Unavailable. Response Time: 0ms. Checks failed from: US-West, EU-Central, AS-East."
          }
        }
      }
    },
    {
      id: 'health-ssl',
      title: 'Health: SSL Expiry',
      icon: Activity,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/20',
      desc: 'Certificate expiring in 29 days (Low Priority).',
      payload: {
        input: {
          meta: { ref_id: "HLT-SSL-EXP", origin: "cert_manager", priority: "LOW" },
          identity: { user_email: "webmaster@fabalos.com", user_company: "Fabalos Domains", user_name: "SSL Checker", user_id: "SYS-SSL-01" },
          incident: {
            title: "SSL Certificate Expiry Warning",
            timestamp: new Date().toISOString(),
            raw: "Domain: fabaverse.net. Expires in: 29 days. Issuer: Let's Encrypt. Auto-renew: Enabled."
          }
        }
      }
    }
  ];

  // --- STATE ---
  let activeScenario: any = null;
  let loading = false;
  let success = false;
  let logs: string[] = [];

  // --- UI ACTIONS ---
  function openModal(scenario: any) {
    activeScenario = scenario;
    success = false;
    logs = [];
  }

  function closeModal() {
    activeScenario = null;
    loading = false;
  }

  const wait = (ms: number) => new Promise(r => setTimeout(r, ms));

  // --- THE REAL INJECTOR (HITS MAKE.COM) ---
  async function injectFault() {
    if (loading) return;
    loading = true;
    logs = [];

    // 1. VISUAL: Preparing Packet
    logs = [...logs, `> INIT_PROTOCOL: ${activeScenario.id.toUpperCase()}`];
    await wait(200);
    logs = [...logs, `> PACKING_PAYLOAD: ${JSON.stringify(activeScenario.payload).length} bytes`];

    try {
      logs = [...logs, `> CONNECTING: hook.eu2.make.com...`];

      // 2. EXECUTION: The Real Network Call
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(activeScenario.payload)
      });

      if (!response.ok) {
        throw new Error(`Make API Error: ${response.status} ${response.statusText}`);
      }

      const responseText = await response.text();

      // 3. SUCCESS: Engine Started
      logs = [...logs, `> 200 OK: Packet Accepted`];
      logs = [...logs, `> SERVER_ACK: "${responseText.substring(0, 50)}..."`];
      logs = [...logs, `> TRIGGER: Make Scenario Started...`];

      success = true;

    } catch (err: any) {
      console.error(err);
      logs = [...logs, `> FATAL_ERROR: Connection Refused`];
      logs = [...logs, `> DEBUG: ${err.message}`];
    } finally {
      loading = false;
    }
  }
</script>

<section class="py-12 border-b border-white/5 bg-[#0B1121]">
  <div class="max-w-7xl mx-auto px-6">

    <div class="flex items-center gap-3 mb-8">
      <div class="h-2 w-2 rounded-full bg-orange-500 animate-pulse"></div>
      <h2 class="text-[10px] font-bold uppercase tracking-widest text-slate-400">
        Command Deck | Fault Injection
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {#each scenarios as item}
        <button
          on:click={() => openModal(item)}
          class="group text-left p-4 rounded-xl border border-white/5 bg-slate-900/50 hover:bg-slate-800 transition-all hover:border-white/10 relative overflow-hidden"
        >
          <div class="absolute inset-0 bg-gradient-to-br from-white/0 to-white/0 group-hover:to-white/5 transition-all"></div>

          <div class="relative z-10">
            <div class="flex items-start justify-between mb-3">
              <div class="p-2 rounded-lg {item.bg} {item.border} border">
                <svelte:component this={item.icon} size={20} class={item.color} />
              </div>
              <div class="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500">
                <Play size={16} />
              </div>
            </div>

            <h3 class="text-sm font-bold text-white mb-1">{item.title}</h3>
            <p class="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
          </div>
        </button>
      {/each}
    </div>

  </div>
</section>

{#if activeScenario}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">

    <div
      class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      transition:fade={{ duration: 200 }}
      on:click={closeModal}
      role="button"
      tabindex="0"
      on:keydown={(e) => e.key === 'Escape' && closeModal()}
    ></div>

    <div
      class="relative w-full max-w-2xl bg-[#0F172A] border border-slate-700 rounded-2xl shadow-2xl shadow-black overflow-hidden flex flex-col max-h-[90vh]"
      transition:fly={{ y: 20, duration: 300 }}
    >

      <div class="px-6 py-4 border-b border-slate-700 flex items-center justify-between bg-[#0B1121]">
        <div class="flex items-center gap-3">
          <svelte:component this={activeScenario.icon} size={18} class={activeScenario.color} />
          <span class="font-bold text-white tracking-tight">Inject {activeScenario.title}</span>
        </div>
        <button on:click={closeModal} class="text-slate-500 hover:text-white transition-colors">
          <X size={20} />
        </button>
      </div>

      <div class="flex-1 overflow-y-auto p-6 space-y-6">

        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs text-slate-500 uppercase tracking-widest font-bold">
            <span>Payload Preview</span>
            <span class="text-emerald-500">JSON Valid</span>
          </div>
          <div class="p-4 rounded-lg bg-[#050505] border border-slate-800 font-mono text-xs text-blue-300 overflow-x-auto">
            <pre>{JSON.stringify(activeScenario.payload, null, 2)}</pre>
          </div>
        </div>

        {#if logs.length > 0}
          <div class="space-y-2" in:fly={{ y: 10 }}>
            <div class="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-bold">
              <Terminal size={12} />
              <span>Injection Logs</span>
            </div>
            <div class="p-4 rounded-lg bg-black border border-slate-800 font-mono text-xs space-y-2 h-32 overflow-y-auto">
              {#each logs as log}
                <div class="text-slate-300 border-l-2 border-slate-700 pl-2">{log}</div>
              {/each}
              {#if loading}
                <span class="animate-pulse text-orange-500">_</span>
              {/if}
            </div>
          </div>
        {/if}

        {#if success}
          <div in:fade class="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
            <CheckCircle2 size={20} />
            <div>
              <div class="font-bold text-sm">Fault Injected Successfully</div>
              <div class="text-xs opacity-80">Row created in DB. Watch the dashboard!</div>
            </div>
          </div>
        {/if}

      </div>

      <div class="p-4 border-t border-slate-700 bg-[#0B1121] flex justify-end gap-3">
        <button
          on:click={closeModal}
          class="px-4 py-2 rounded-lg text-sm font-bold text-slate-400 hover:text-white transition-colors"
        >
          Cancel
        </button>
        <button
          on:click={injectFault}
          disabled={loading || success}
          class="px-6 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold shadow-lg shadow-orange-900/20 flex items-center gap-2 transition-all"
        >
          {#if loading}
            <Loader2 size={16} class="animate-spin" /> Injecting...
          {:else if success}
            Done
          {:else}
            <AlertTriangle size={16} /> Inject Fault
          {/if}
        </button>
      </div>

    </div>
  </div>
{/if}