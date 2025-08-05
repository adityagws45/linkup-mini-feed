import { createClient } from '@supabase/supabase-js';

// These will be automatically provided by Lovable's Supabase integration
const supabaseUrl = 'https://ualcsswtztyticwobatg.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVhbGNzc3d0enR5dGljd29iYXRnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzNzYwMzksImV4cCI6MjA2OTk1MjAzOX0.SSUHd4lfkPYjoW2NXQd86JQxtInxRdgZMHKCs_EH0hA';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database Types
export interface Profile {
  id: string;
  email: string;
  name: string;
  bio?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Post {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  profiles: Profile;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}