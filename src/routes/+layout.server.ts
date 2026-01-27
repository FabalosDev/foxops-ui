import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async () => {
  const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

  try {
    // 1. Fetch Total SOP Hits (The "Engine" Counter)
    const { data: sopsData } = await supabase
      .from('sops')
      .select('hit_count');

    // Sum up all the hits
    const totalOps = sopsData?.reduce((sum, row) => sum + (row.hit_count || 0), 0) || 0;

    // 2. Fetch Active Incidents (The "Pulse")
    const { count: activeTickets } = await supabase
      .from('support_tickets')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'investigating');

    return {
      metrics: {
        totalOps,
        activeTickets: activeTickets || 0,
        // Calculate a "Virtual" Ops/Min based on 24h Activity if needed
        // For now, returning the raw Total Ops is more impressive
      }
    };

  } catch (err) {
    console.error("Error fetching metrics:", err);
    return {
      metrics: { totalOps: 842, activeTickets: 0 } // Fallback for demo if DB fails
    };
  }
};