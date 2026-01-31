// CHANGE THIS IMPORT:
// from: import { createClient } from '@supabase/supabase-js';
// to:
import { createBrowserClient } from '@supabase/ssr';

import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public';

// Diagnostic Check
if (!PUBLIC_SUPABASE_URL || !PUBLIC_SUPABASE_ANON_KEY) {
  throw new Error('CRITICAL ERROR: Missing Supabase Environment Variables in .env file');
}

// CHANGE THIS EXPORT:
// Use createBrowserClient so authentication sets the cookies that hooks.server.ts reads!
export const supabase = createBrowserClient(PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY);