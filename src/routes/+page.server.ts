import { supabase } from '$lib/supabaseClient';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  console.log('[FOXOPS SERVER] Fetching dashboard telemetry...');

  // Execute all DB queries in parallel for speed
  const [activeRes, reportsRes, statsRes] = await Promise.all([

    // 1. Get Active Incidents (FIXED: Uses created_at)
    supabase
      .from('incidents')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5),

    // 2. Get Recent Forensic Reports
    supabase
      .from('incident_reports')
      .select('*')
      .order('archived_at', { ascending: false })
      .limit(5),

    // 3. Get ALL statuses for calculating counters
    supabase
      .from('incidents')
      .select('status')
  ]);

  // Log errors for debugging
  if (activeRes.error) console.error('[DB ERROR] Incidents:', activeRes.error);
  if (reportsRes.error) console.error('[DB ERROR] Reports:', reportsRes.error);

  // Stats Calculation Logic
  const allIncidents = statsRes.data || [];

  const stats = {
    active: allIncidents.filter(i =>
      i.status.includes('ACTIVE') ||
      i.status.includes('ANALYZING')
    ).length,

    healed: allIncidents.filter(i =>
      i.status.includes('RESOLVED') ||
      i.status.includes('HEALED')
    ).length,

    learning: allIncidents.filter(i =>
      i.status.includes('LEARNING') ||
      i.status.includes('DRAFT') ||
      i.status.includes('USER_REPLIED')
    ).length,

    critical: allIncidents.filter(i =>
      i.status.includes('ESCALATED') ||
      i.status.includes('CRITICAL') ||
      i.status.includes('ACTION_REQUIRED')
    ).length
  };

  return {
    activeIncidents: activeRes.data || [],
    recentReports: reportsRes.data || [],
    stats
  };
};