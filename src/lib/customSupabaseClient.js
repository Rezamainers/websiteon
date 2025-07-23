import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://iyvhwgdiejiaiwrfygou.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5dmh3Z2RpZWppYWl3cmZ5Z291Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3NjMzNzcsImV4cCI6MjA2ODMzOTM3N30.dzhjKcnz3_2r9N61xV5e1LSeTRPcXa8wySEv538vcQA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);