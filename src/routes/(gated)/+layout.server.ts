import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent }) => {
    // 1. Wait for the root layout to get the session
    const { session } = await parent();

    // 2. THE CHECK: If no session, kick them out
    if (!session) {
        throw redirect(303, '/login'); // Or wherever your login page is
    }

    // 3. If safe, let them pass
    return { session };
};