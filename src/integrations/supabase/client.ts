// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://gyunwjlhcdlposlicatl.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5dW53amxoY2RscG9zbGljYXRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg1MDUxMTMsImV4cCI6MjA2NDA4MTExM30.6OCc4z1741O-hqD7wBhi0kEvDvfKwNuC9brHGKAavKI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);