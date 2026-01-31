// FILE: src/routes/+page.server.ts
import { createClient } from '@supabase/supabase-js';
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

export const load = async () => {
    const supabase = createClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);

    try {
        // 1. Fetch LIVE Incidents (For Feed & KPIs)
        const { data: rawIncidents, error } = await supabase
            .from('incidents')
            .select(`
                *,
                support_tickets!fk_incidents (
                    id,
                    sop_match_id
                )
            `)
.order('created_at', { ascending: false }) // 1st Priority: Time
.order('id', { ascending: false });        // 2nd Priority: ID (Tie-breaker)

        if (error) throw error;

        // 2. Fetch SOP Stats (For Global Hit Count)
        const { data: sopsData } = await supabase
            .from('sops')
            .select('hit_count');

        const totalOps = sopsData?.reduce((sum, row) => sum + (row.hit_count || 0), 0) || 0;

        // ---------------------------------------------------------
        // ✅ 3. THE MISSING PIECE: Fetch Recent Reports for Archive
        // ---------------------------------------------------------
        const { data: recentReports } = await supabase
            .from('incident_reports')
            .select('*')
            .order('archived_at', { ascending: false })
            .limit(20); // Limit to 20 so we don't overload the panel

        // 4. Flatten Data for Frontend
        const incidents = (rawIncidents || []).map(inc => {
             const ticket = Array.isArray(inc.support_tickets) ? inc.support_tickets[0] : inc.support_tickets;
             return {
                 ...inc,
                 sop_match_id: ticket?.sop_match_id || null,
                 linked_ticket_id: ticket?.id || null
             };
        });

        return {
            allIncidents: incidents,
            // ✅ Return the missing data here:
            recentReports: recentReports || [],
            metrics: {
                totalOps,
            },
            stats: {
                investigating: incidents.filter(i => i.status?.includes('INVESTIGATING')).length,
                learning: incidents.filter(i => i.status?.includes('LEARNING')).length,
                selfHealed: incidents.filter(i => i.status?.includes('AUTO_HEALED')).length,
                escalated: incidents.filter(i => i.status?.includes('ESCALATED') || i.status?.includes('HUMAN_REQ')).length,
                resolved: incidents.filter(i => i.status?.includes('RESOLVED')).length,
                invalid: incidents.filter(i => i.status?.includes('CLOSED') || i.status?.includes('NON_ACTIONABLE')).length
            }
        };

    } catch (err) {
        console.error("Error fetching FoxOps metrics:", err);
        return {
            allIncidents: [],
            recentReports: [], // Fallback empty array
            metrics: { totalOps: 0 },
            stats: { investigating: 0, learning: 0, selfHealed: 0, escalated: 0, resolved: 0, invalid: 0 }
        };
    }
};