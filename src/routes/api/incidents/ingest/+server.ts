import { json } from '@sveltejs/kit';
import { MAKE_WEBHOOK_URL } from '$env/static/private';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request }) => {
  // 0. Security Check
  if (!MAKE_WEBHOOK_URL) {
    console.error('CRITICAL: MAKE_WEBHOOK_URL is missing in .env');
    return json({ error: 'Server misconfiguration' }, { status: 500 });
  }

  try {
    const rawData = await request.json();

    // 1. Normalize Data (The "Flat" Protocol)
    const rawErrorText = String(rawData.incident_raw || rawData.incident_description || "No raw telemetry provided.");

    // 🔥 NEW: Deterministic Signature Generation
    // We create a "Stable" version of the error for Gemini to analyze
    const stableSignature = normalizeErrorSignature(rawErrorText);

    const flatPayload = {
      origin:         String(rawData.origin || "Unknown_Source"),
      priority:       validatePriority(rawData.priority),
      user_company:   String(rawData.user_company || rawData.unit_company || "Fabalos_Standard"),
      user_name:      String(rawData.user_name || "System_Operator"),
      user_id:        String(rawData.user_id || "GUEST_USER"),
      user_email:     validateEmail(rawData.user_email),

      incident_title: String(rawData.incident_title || "Automation Alert: Undefined Incident"),

      // ✅ We send BOTH: The raw data for humans, and the normalized signature for AI
      incident_raw:   rawErrorText,
      ai_signature:   stableSignature,

      timestamp:      rawData.timestamp || new Date().toISOString()
    };

    // 2. Forward to Make.com
    const makeResponse = await fetch(MAKE_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(flatPayload)
    });

    if (!makeResponse.ok) {
      console.error(`Make.com Error: ${makeResponse.statusText}`);
      return json({ error: 'Automation Engine unavailable' }, { status: 502 });
    }

    const makeResult = await makeResponse.text();

    return json({
      status: 'Success',
      id: `${flatPayload.user_id}-${Date.now()}`,
      provider_response: makeResult
    });

  } catch (err) {
    console.error('Ingest Error:', err);
    return json({ error: 'Invalid Payload' }, { status: 400 });
  }
};

// ===== HELPERS =====

/**
 * Strips variable data (IDs, Timestamps, Hex Codes) from error logs
 * to ensure Gemini generates consistent Vector Embeddings.
 */
function normalizeErrorSignature(text: string): string {
    return text
        // Replace Hex Codes (0x45F, 0x1A) -> {HEX}
        .replace(/0x[0-9a-fA-F]+/g, '{HEX}')

        // Replace UUIDs -> {UUID}
        .replace(/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi, '{UUID}')

        // Replace IP Addresses -> {IP}
        .replace(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/g, '{IP}')

        // Replace Timestamps (ISO or Simple) -> {TIME}
        .replace(/\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/g, '{TIME}')
        .replace(/\d{2}:\d{2}:\d{2}/g, '{TIME}')

        // Replace large numbers (IDs) -> {NUM}
        .replace(/\b\d{5,}\b/g, '{NUM}');
}

function validateEmail(email: any): string {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email)) ? String(email) : 'admin@fabalos.com';
}

function validatePriority(p: any): string {
  const valid = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const up = String(p || '').toUpperCase();
  return valid.includes(up) ? up : 'LOW';
}