import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DecisionNode {
  id: string;
  type: 'decision' | 'factor';
  text: string;
  weight?: number;
  x: number;
  y: number;
}

export interface Connection {
  from: string;
  to: string;
}

export interface DecisionMap {
  id: string;
  user_id: string;
  name: string;
  nodes: DecisionNode[];
  connections: Connection[];
  created_at: string;
  updated_at: string;
}

export interface BudgetGoal {
  id: string;
  user_id: string;
  goal_name: string;
  target_amount: number;
  current_saved: number;
  created_at: string;
  updated_at: string;
}

export interface UserSubscription {
  id: string;
  user_id: string;
  is_premium: boolean;
  premium_since: string | null;
  created_at: string;
  updated_at: string;
}
