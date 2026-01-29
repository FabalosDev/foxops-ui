import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async () => {
    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

    try {
        // 1. Fetch Total SOP Hits (Total Operations)
        const { data: sopsData } = await supabase.from('sops').select('hit_count');
        const totalOps = sopsData?.reduce((sum, row) => sum + (row.hit_count || 0), 0) || 0;

        // 2. Get the Actual Row Count of the incidents table
        const { count: pipelineTotal, data: incidentsData } = await supabase
            .from('incidents')
            .select('*', { count: 'exact' });

        return {
            allIncidents: incidentsData || [],
            metrics: {
                totalOps,
                pipelineTotal: pipelineTotal || 0, // This is your row count
                activeTickets: incidentsData?.filter(i =>
                    i.status?.includes('INVESTIGATING') || i.status?.includes('LEARNING')
                ).length || 0
            }
        };
    } catch (err) {
        console.error("Telemetry Error:", err);
        return { allIncidents: [], metrics: { totalOps: 0, pipelineTotal: 0, activeTickets: 0 } };
    }
};