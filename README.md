# 🦊 FoxOps // SENTINEL

**The "Context Healer" for Fabalos OS.**

FoxOps is a secure, session-scoped interface that allows users to intervene when an automation workflow fails. Instead of dying silently in a log file, the system redirects the user to this "Recovery Room" to fix their data in real-time.

### ⚡ Technical Stack
- **Frontend:** SvelteKit (Vercel Adapter)
- **State/Auth:** Supabase Realtime + Row Level Security
- **Orchestration:** Make.com (Master Scenario)
- **Intelligence:** Google Gemini 1.5 Pro via Vertex AI

> Part of the **Master of Make 2026** Submission.

# 🦊 FoxOps: Autonomous Industrial Remediation Engine

![Status](https://img.shields.io/badge/STATUS-STABLE-success?style=for-the-badge)
![Lane](https://img.shields.io/badge/LANE-1_CAREER-blue?style=for-the-badge)
![Version](https://img.shields.io/badge/VERSION-1.0.0-orange?style=for-the-badge)

> **"If it’s not documented, it didn’t happen."**
> Bridging AI Reasoning (Gemini) with Industrial Execution (Make + MCP) to turn silent failures into auditable assets.

---

## 1. Executive Summary

**FoxOps** is a closed-loop automation architecture designed to detect, analyze, and resolve industrial mechatronic failures in real-time. Unlike passive logging systems, FoxOps actively executes **"Self-Healing Cycles"** using Vector Search for SOP matching and deterministic logic for incident reporting.

This repository contains the **Frontend Dashboard**, built with **SvelteKit**, which visualizes the real-time remediation process and renders forensic forensic PDF reports.

## 2. Technical Stack

* **Orchestration:** Make.com (Webhooks, Logic Routing)
* **Database:** Supabase (PostgreSQL, pgvector, Auth)
* **Frontend:** SvelteKit (Real-time Dashboard, PDF Rendering)
* **Intelligence:** AI Analyst (Contextual Reasoning) + Vector Embeddings
* **Runtime:** JavaScript (Code Nodes for Data Transformation)

---

## 3. Data Flow Architecture

The system operates on a linear, idempotent pipeline:

### Phase A: Ingestion & Sanitization
1.  **IoT Trigger:** Edge devices send raw error logs (containing control characters, CRLF, unescaped quotes) to the Make.com Webhook.
2.  **Transport Layer Sanitization:**
    * Raw payloads are passed through a **Native JSON Serialization Module**.
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
    * Stores live/ongoing issues. Optimized for high-speed dashboard queries.
2.  **Compliance Archival (`public.incident_reports`):**
    * *Trigger:* Only when Status = `RESOLVED`.
    * The finalized HTML report and SOP snapshot are committed to cold storage.
    * Provides immutable audit trails for regulatory compliance.

---

## 4. Key Technical Features

### 🛡️ Transport-Layer Integrity
Implemented a "No-Code" Native JSON serializer to handle multi-line mechatronic SOPs. This eliminates "Bad Control Character" errors common in legacy industrial data, ensuring 100% payload delivery to the frontend.

### 📄 Server-Side Forensic Reporting
The system generates a styled, legal-grade HTML report within the orchestration layer.
* **Benefit:** The SvelteKit frontend simply renders the HTML string (`{@html incident.html_report}`).
* **Output:** Ready-to-print PDF format with timestamps, severity levels, and validation hashes.

### ♻️ Database Normalization Strategy
Separation of concerns between **Operational Data** (Live) and **Forensic Data** (Archive).
* **`incidents` table:** Lightweight, JSONB payloads.
* **`incident_reports` table:** Heavyweight, TEXT-based HTML storage.

---

## 5. API Payload Specification

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