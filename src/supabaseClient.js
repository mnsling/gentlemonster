import { createClient } from '@supabase/supabase-js'

// Replace these with the values you just copied
const supabaseUrl = 'https://gacjaxaolpqzcaamhrjo.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdhY2pheGFvbHBxemNhYW1ocmpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2ODg1NzEsImV4cCI6MjA5MzI2NDU3MX0.YRrUd2ooa0qc7mxsDqE0d_sfnYqXkXTUFX7_1Y9mS0c'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)