// FILE: src/routes/+page.server.ts
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async () => {
    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

    try {
        // 1. Fetch all incidents for the 6 Cards and the 4 KPIs
        const { data: allIncidents } = await supabase
            .from('incidents')
            .select('status, created_at, timestamp_drafted, sop_match_id');

        // 2. Fetch SOP Hit Counts (Total Operations)
        const { data: sopsData } = await supabase
            .from('sops')
            .select('hit_count');

        const totalOps = sopsData?.reduce((sum, row) => sum + (row.hit_count || 0), 0) || 0;

        const incidents = allIncidents || [];

        return {
            allIncidents: incidents, // Pass raw data for Frontend KPI logic
            metrics: {
                totalOps,
            },
            stats: {
                investigating: incidents.filter(i => i.status?.includes('INVESTIGATING')).length,
                learning: incidents.filter(i => i.status?.includes('LEARNING')).length,
                selfHealed: incidents.filter(i => i.status?.includes('AUTO_HEALED')).length,
                escalated: incidents.filter(i => i.status?.includes('ESCALATED')).length,
                resolved: incidents.filter(i => i.status?.includes('RESOLVED')).length,
                invalid: incidents.filter(i => i.status?.includes('CLOSED')).length
            }
        };

    } catch (err) {
        console.error("Error fetching FoxOps metrics:", err);
        return {
            allIncidents: [],
            metrics: { totalOps: 0 },
            stats: { investigating: 0, learning: 0, selfHealed: 0, escalated: 0, resolved: 0, invalid: 0 }
        };
    }
};