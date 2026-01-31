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
    const flatPayload = {
      origin:         String(rawData.origin || "Unknown_Source"),
      priority:       validatePriority(rawData.priority),
      user_company:   String(rawData.user_company || rawData.unit_company || "Fabalos_Standard"),
      user_name:      String(rawData.user_name || "System_Operator"),
      user_id:        String(rawData.user_id || "GUEST_USER"),
      user_email:     validateEmail(rawData.user_email),

      // Pass text EXACTLY as received. JSON.stringify handles the safety downstream.
      incident_title: String(rawData.incident_title || "Automation Alert: Undefined Incident"),
      incident_raw:   String(rawData.incident_raw || rawData.incident_description || "No raw telemetry provided."),

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

    // 3. Success
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
function validateEmail(email: any): string {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email)) ? String(email) : 'admin@fabalos.com';
}

function validatePriority(p: any): string {
  const valid = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
  const up = String(p || '').toUpperCase();
  return valid.includes(up) ? up : 'LOW';
}