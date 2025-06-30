export interface User {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'client';
  points: number;
  createdAt: string;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  pointsReward: number;
  isActive: boolean;
  createdAt: string;
}

export interface Code {
  id: string;
  planId: string;
  code: string;
  isUsed: boolean;
  usedBy?: string;
  usedAt?: string;
  createdAt: string;
}

export interface Purchase {
  id: string;
  clientId: string;
  planId: string;
  codeId: string;
  amount: number;
  pointsEarned: number;
  status: 'completed' | 'pending' | 'failed';
  createdAt: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  loading: boolean;
}

export interface AppContextType {
  users: User[];
  plans: Plan[];
  codes: Code[];
  purchases: Purchase[];
  loading: boolean;
  createPlan: (plan: Omit<Plan, 'id' | 'createdAt'>) => Promise<boolean>;
  updatePlan: (id: string, plan: Partial<Plan>) => Promise<boolean>;
  deletePlan: (id: string) => Promise<void>;
  addCodes: (planId: string, codes: string[]) => Promise<void>;
  purchasePlan: (clientId: string, planId: string) => Promise<Purchase | null>;
  updateUserPoints: (userId: string, points: number) => Promise<void>;
}

// Database mapping types
export interface DatabaseUser {
  id: string;
  name: string;
  email: string;
  type: 'admin' | 'client';
  points: number;
  created_at: string;
}

export interface DatabasePlan {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  features: string[];
  points_reward: number;
  is_active: boolean;
  created_at: string;
}

export interface DatabaseCode {
  id: string;
  plan_id: string;
  code: string;
  is_used: boolean;
  used_by: string | null;
  used_at: string | null;
  created_at: string;
}

export interface DatabasePurchase {
  id: string;
  client_id: string;
  plan_id: string;
  code_id: string;
  amount: number;
  points_earned: number;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}