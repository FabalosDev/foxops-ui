import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  console.log('[FOXOPS SERVER] Fetching dashboard telemetry...');

  // Execute queries in parallel
  const [activeRes, reportsRes, statsRes] = await Promise.all([

    // 1. Get Active Incidents (FIXED: generated_at -> created_at)
    supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false }) // <--- FIX HERE
      .limit(5),

    // 2. Get Recent Forensic Reports (Archive table uses archived_at, so this is fine)
    supabase
      .from('incident_reports')
      .select('*')
      .order('archived_at', { ascending: false })
      .limit(5),

    // 3. Get ALL statuses for counters
    supabase
      .from('incidents')
      .select('status')
  ]);

  // Handle Errors
  if (activeRes.error) console.error('Incidents Error:', activeRes.error);
  if (reportsRes.error) console.error('Reports Error:', reportsRes.error);

  // Stats Logic
  const allIncidents = statsRes.data || [];

  const stats = {
    active: allIncidents.filter(i => i.status.includes('ACTIVE') || i.status.includes('ANALYZING')).length,
    healed: allIncidents.filter(i => i.status.includes('RESOLVED') || i.status.includes('HEALED')).length,
    learning: allIncidents.filter(i => i.status.includes('LEARNING') || i.status.includes('DRAFT') || i.status.includes('USER_REPLIED')).length,
    critical: allIncidents.filter(i => i.status.includes('ESCALATED') || i.status.includes('CRITICAL') || i.status.includes('ACTION_REQUIRED')).length
  };

  return {
    activeIncidents: activeRes.data || [],
    recentReports: reportsRes.data || [],
    stats
  };
};