import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nzkohsmbgfrvbpxatluh.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im56a29oc21iZ2ZydmJweGF0bHVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyMDcxODQsImV4cCI6MjA3NTc4MzE4NH0.NYsXlh0Mo4One6IMe9vP3MpsHvF4dVoyW9Z3VkppB2E"; // Replace with your actual anon key from Supabase Dashboard

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: "pkce",
  },
});
