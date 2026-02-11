import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async ({ locals }) => {
    // 1. INDUSTRIAL AUTH:
    // We use locals.supabase to get the User and Session.
    // This ensures we are compliant with the latest security standards.
    const { data: { user } } = await locals.supabase.auth.getUser();
    const { data: { session } } = await locals.supabase.auth.getSession();

    // 2. Fetch Metrics (Keep your existing data logic)
    // We create a separate admin/anon client for fetching public stats if needed,
    // or you could use locals.supabase if RLS allows it. Sticking to your pattern:
    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

    try {
        const { data: sopsData } = await supabase.from('sops').select('hit_count');
        const totalOps = sopsData?.reduce((sum, row) => sum + (row.hit_count || 0), 0) || 0;

        const { count: pipelineTotal, data: incidentsData } = await supabase
            .from('incidents')
            .select('*', { count: 'exact' });

        return {
            session,
            user, // ✅ Expose validated user to the app
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
        // Return user/session even on error so the app doesn't crash
        return {
            session,
            user,
            allIncidents: [],
            metrics: { totalOps: 0, pipelineTotal: 0, activeTickets: 0 }
        };
    }
};