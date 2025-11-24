// Initialize supabase
import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://vqalqtpyolsfqbdchamn.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)