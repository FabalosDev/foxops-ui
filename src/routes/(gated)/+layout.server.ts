import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent, locals: { supabase } }) => {
    // Get session for token reference if needed
    const { session } = await parent();

    // INDUSTRIAL SECURITY CHECK:
    // Instead of trusting the cookie (session), we verify with the Supabase server.
    // This kills the "insecure" console warning.
    const { data: { user }, error } = await supabase.auth.getUser();

    // The Guard: If Supabase says "No User" or Error, redirect immediately.
    if (error || !user) {
        throw redirect(303, '/login');
    }

    return { session, user };
};