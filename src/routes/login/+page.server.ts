import { redirect } from '@sveltejs/kit';

export const load = async ({ locals }) => {
    const session = await locals.getSession();

    // If already logged in, go to Dashboard
    if (session) {
        throw redirect(303, '/');
    }

    return {};
};