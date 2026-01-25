import { createClient } from '@supabase/supabase-js'

// Replace these with your EXISTING Fabalos keys from your .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)