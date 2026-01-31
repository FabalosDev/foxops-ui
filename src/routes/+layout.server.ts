import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ locals }) => {
    // 1. ✅ GET SESSION VIA HOOKS (This prevents the 500 Error)
    const session = await locals.getSession();

    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

    try {
        // 2. Fetch Metrics (Existing Logic)
        const { data: sopsData } = await supabase.from('sops').select('hit_count');
        const totalOps = sopsData?.reduce((sum, row) => sum + (row.hit_count || 0), 0) || 0;

        const { count: pipelineTotal, data: incidentsData } = await supabase
            .from('incidents')
            .select('*', { count: 'exact' });

        return {
            session, // <-- PASS THIS TO FRONTEND
            allIncidents: incidentsData || [],
            metrics: {
                totalOps,
                pipelineTotal: pipelineTotal || 0,
                activeTickets: incidentsData?.filter(i =>
                    i.status?.includes('INVESTIGATING') || i.status?.includes('LEARNING')
                ).length || 0
            }
        };
    } catch (err) {
        console.error("Telemetry Error:", err);
        return { session, allIncidents: [], metrics: { totalOps: 0, pipelineTotal: 0, activeTickets: 0 } };
    }
};