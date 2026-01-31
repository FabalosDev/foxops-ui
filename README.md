![Status](https://img.shields.io/badge/STATUS-STABLE-success?style=for-the-badge)
![Lane](https://img.shields.io/badge/LANE-1_CAREER-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/VERSION-1.0.0-orange?style=for-the-badge)

# 🦊 FoxOps' Autonomous Self-Healing Infrastructure & SOP Generation

> **"If it’s not documented, it didn’t happen."**
>
> The "Context Healer" for Fabalos OS. Bridging AI Reasoning (Gemini 2.0) with Industrial Execution (Make + MCP) to turn silent failures into auditable assets.

---

## 1. Executive Summary

**FoxOps** is a universal autonomous incident response system designed to detect, analyze, and resolve technical failures across **ANY** domain—from industrial sensors and RPA bots to API gateways and Cloud infrastructure.

Unlike passive logging tools, FoxOps actively executes **"Self-Healing Cycles"**. It uses Vector Search to match error signatures against a knowledge base of Standard Operating Procedures (SOPs), executes the fix via Make.com, and auto-generates forensic documentation.

**The Core Philosophy:** The system doesn't care _where_ the error comes from. If it generates an error message, FoxOps can triage it, fix it, and document it.

---

## 2. System Architecture

The architecture follows a strict **"Observe-Orient-Decide-Act" (OODA)** loop, leveraging Edge Computing for sanitization and Agentic AI for reasoning.

### 🧠 The Intelligence Stack

- **Ingestion (The Shield):** Cloudflare Worker acts as the firewall, sanitizing raw logs into deterministic **AI Signatures** (e.g., converting `0x4F5A` → `{HEX}`) to ensure Idempotency.

- **The Brain (Reasoning):** **Gemini 2.0 Flash** handles high-speed triage (0.4s latency), while **Gemini 1.5 Pro** handles deep forensic analysis and SOP generation.

- **The Memory (Context):** **Supabase Vector** stores SOP embeddings, allowing the system to recall fixes for similar incidents ("Semantic Recall").

- **The Hands (Action):** **Make.com** acts as the orchestration bus, connecting the brain to 500+ services (Slack, Jira, AWS, Email).


---

## 3. Key Features

### 🛡️ Deterministic "AI Signature" Normalization

To prevent "LLM Hallucinations" and ensure consistent vector matching, FoxOps strips variable data (IPs, Timestamps, Memory Addresses) at the edge.

- _Raw Input:_ `Error: Connection timeout at 192.168.1.55`

- _FoxOps Signature:_ `Error: Connection timeout at {IP}`

- _Result:_ 100% Consistent SOP Retrieval.


### 🔄 The Self-Healing Loop

1. **Detect:** Log arrives via Webhook.

2. **Search:** System queries Vector DB for an existing SOP.

3. **Execute:** If found, the SOP (e.g., "Restart Service") is executed automatically.

4. **Learn:** If **NOT** found, Gemini Pro researches the error, drafts a _new_ SOP, and saves it to the database for next time.


### 📄 Instant Forensic HTML Reporting

FoxOps doesn't just fix the issue; it proves it. Every incident generates an immutable **Forensic Report** containing:

- Timestamp & Severity

- Tech Stack Trace

- Resolution Actions

- HTML-formatted layout ready for Email/PDF.


## 4. Universal Error Intelligence

FoxOps operates as a central nervous system for technical infrastructure, handling distinct failure classes with a single engine:

| Domain | Error Type | Auto-Heal Strategy |
| :--- | :--- | :--- |
| 🏭 **Industrial** | `Pressure < 4.0 bar` | Trigger Maintenance Stop SOP |
| 🤖 **RPA Bots** | `ElementNotFound` | Execute Fallback Selector Logic |
| ☁️ **DevOps** | `503 Service Unavailable` | Restart Service / Scale Resources |
| 🔐 **Security** | `403 Unauthorized` | Revoke Token & Log Incident |
| 💳 **FinTech** | `Webhook Sig Mismatch` | Request Re-signing / Alert Ops |

---

## 5. Technical Stack

| Layer | Technology | Function |
| :--- | :--- | :--- |
| **Edge Compute** | **Cloudflare Workers** | **Traffic Sanitization & Pre-processing** |
| **Frontend** | SvelteKit (Vercel) | Real-time Dashboard & PDF Rendering |
| **Orchestration** | Make.com | Master Scenario & Logic Routing |
| **Database** | Supabase | PostgreSQL + pgvector (Knowledge Base) |
| **Auth** | Supabase Auth | Row Level Security (RLS) & Server Hooks |
| **Intelligence** | Gemini 1.5 Pro | Reasoning Agent via Vertex AI |

---

## 6. Data Flow Architecture

The system operates on a linear, idempotent pipeline designed to handle "dirty" industrial data without crashing.

### Phase A: Ingestion & Edge Sanitization
1.  **IoT Trigger:** Edge devices send raw error logs (often containing control characters, CRLF, and unescaped quotes).
2.  **🛡️ Cloudflare Sentinel (Pre-processing):**
    * Incoming webhooks hit a dedicated Cloudflare Worker *before* reaching the orchestration layer.
    * **Action:** Strips unwanted metadata, blocks malformed payloads, and sanitizes headers to ensure only valid JSON enters the pipeline.
3.  **Transport Layer Normalization:**
    * Validated payloads are passed to the Make.com Native JSON Serialization Module.
    * *Purpose:* Automatically escapes `\n`, `\t`, and `"` to prevent JSON syntax violations (RFC 8259 compliance).

### Phase B: Logic & Analysis
1.  **Vector Search:** The error signature is embedded and queried against the `knowledge_base` in Supabase.
2.  **Decision Engine:**
    * **Match Found (>0.85):** Trigger **Self-Healing** (Green Lane).
    * **No Match:** Trigger **Analyst Escalation** (Red Lane).
3.  **Deterministic Transformation (Code Node):**
    * If `SOP Title` is null (New Incident), the system performs a logic fallback to use `Ticket Title`.
    * Generates a **Forensic HTML Report** string server-side.

### Phase C: Persistence & Lifecycle
1.  **Active Operations (`public.incidents`):**
    * Stores live/ongoing issues. Optimized for high-speed dashboard queries via Supabase Realtime.
2.  **Compliance Archival (`public.incident_reports`):**
    * *Trigger:* Only when Status = `RESOLVED`.
    * The finalized HTML report and SOP snapshot are committed to cold storage.
    * Provides immutable audit trails for regulatory compliance.

---

## 7. 4-Layer "Omnichannel" Ingestion
FoxOps doesn't just listen to one stream. It monitors the entire operational reality across four dimensions:

| Dimension | Entry Point | Example Scenario |
| :--- | :--- | :--- |
| 👤 **Human Layer** | **Support Portal** | Operator reports "Conveyor belt vibration" via web UI. |
| 🧠 **Logic Layer** | **Workflow Handler** | Make.com scenario fails due to API Rate Limit (429). |
| 🏭 **Physical Layer** | **IoT Sensors** | Festo Pressure Sensor drops below 4.0 bar critical threshold. |
| 💓 **Vital Layer** | **Health Pings** | Cron job detects Supabase Database latency > 200ms. |

**Result:** Whether it's a broken machine, a confused user, a crashed script, or a network outage—FoxOps catches it.

---

## 8. Key Technical Features

### 🛡️ Edge-Layer Data Scrubbing (Cloudflare)
To protect the automation engine from "Garbage In, Garbage Out," a Cloudflare Worker acts as the gatekeeper. It intercepts raw TCP streams from industrial controllers, removing non-compliant characters and enforcing schema validation before the data ever consumes a Make.com operation.

### ⚡ Transport-Layer Integrity
Implemented a "No-Code" Native JSON serializer to handle multi-line mechatronic SOPs. This eliminates "Bad Control Character" errors common in legacy industrial data, ensuring 100% payload delivery to the frontend.

### 📄 Server-Side Forensic Reporting
The system generates a styled, legal-grade HTML report within the orchestration layer.
* **Benefit:** The SvelteKit frontend simply renders the HTML string (`{@html incident.html_report}`).
* **Output:** Ready-to-print PDF format with timestamps, severity levels, and validation hashes.

---

## 9. API Payload Specification

The SvelteKit frontend receives the following standardized JSON structure via the Webhook Response:

```json
{
  "tenant": {
    "id": "FAB-IND-01",
    "name": "Festo Industrial Plant"
  },
  "user": {
    "email": "demo+festo@fabalos.com"
  },
  "incident": {
    "id": "uuid-v4",
    "title": "Actuator Cycle Timeout - Station 04",
    "status": "⚡ ACTIVE: SELF-HEALING CYCLE IN PROGRESS",
    "priority": "MEDIUM",
    "raw_error": "E-2044 // LATENCY_DETECTED...",
    "sop_title": "Troubleshooting Incomplete Pneumatic Stroke...",
    "sop_procedure": "Step 1: Apply LOTO...\nStep 2: Inspect S3...",
    "html_report": "<div style='...'><h1>CRITICAL INCIDENT REPORT</h1>...</div>",
    "generated_at": "2026-01-27T10:00:00.000Z"
  }
}

```
---

## 10. Deployment

### Prerequisites

- Supabase Project with `vector` extension enabled.

- Google Vertex AI / Gemini API Key.

- Make.com Account.


### Quick Start

Bash

```
# 1. Clone the Repository
git clone https://github.com/fabalos/foxops-engine.git

# 2. Deploy Edge Worker
npx wrangler deploy

# 3. Configure Make Webhook
# Point your application logging driver to the Cloudflare Worker URL.
```

---

> **Part of the Master of Make 2026 Submission.**
> *Architected by Fabalos.*