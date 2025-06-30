import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types based on our schema
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          name: string;
          email: string;
          type: 'admin' | 'client';
          points: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          type?: 'admin' | 'client';
          points?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          type?: 'admin' | 'client';
          points?: number;
          created_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          duration: string;
          features: string[];
          points_reward: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description: string;
          price: number;
          duration: string;
          features: string[];
          points_reward: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          duration?: string;
          features?: string[];
          points_reward?: number;
          is_active?: boolean;
          created_at?: string;
        };
      };
      codes: {
        Row: {
          id: string;
          plan_id: string;
          code: string;
          is_used: boolean;
          used_by: string | null;
          used_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          plan_id: string;
          code: string;
          is_used?: boolean;
          used_by?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          plan_id?: string;
          code?: string;
          is_used?: boolean;
          used_by?: string | null;
          used_at?: string | null;
          created_at?: string;
        };
      };
      purchases: {
        Row: {
          id: string;
          client_id: string;
          plan_id: string;
          code_id: string;
          amount: number;
          points_earned: number;
          status: 'completed' | 'pending' | 'failed';
          created_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          plan_id: string;
          code_id: string;
          amount: number;
          points_earned: number;
          status?: 'completed' | 'pending' | 'failed';
          created_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          plan_id?: string;
          code_id?: string;
          amount?: number;
          points_earned?: number;
          status?: 'completed' | 'pending' | 'failed';
          created_at?: string;
        };
      };
    };
  };
}