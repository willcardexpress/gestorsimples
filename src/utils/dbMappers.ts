import { 
  User, Plan, Code, Purchase, 
  DatabaseUser, DatabasePlan, DatabaseCode, DatabasePurchase 
} from '../types';

// Map database objects to frontend objects
export const mapDatabaseUser = (dbUser: DatabaseUser): User => ({
  id: dbUser.id,
  name: dbUser.name,
  email: dbUser.email,
  type: dbUser.type,
  points: dbUser.points,
  createdAt: dbUser.created_at
});

export const mapDatabasePlan = (dbPlan: DatabasePlan): Plan => ({
  id: dbPlan.id,
  name: dbPlan.name,
  description: dbPlan.description,
  price: dbPlan.price,
  duration: dbPlan.duration,
  features: dbPlan.features,
  pointsReward: dbPlan.points_reward,
  isActive: dbPlan.is_active,
  createdAt: dbPlan.created_at
});

export const mapDatabaseCode = (dbCode: DatabaseCode): Code => ({
  id: dbCode.id,
  planId: dbCode.plan_id,
  code: dbCode.code,
  isUsed: dbCode.is_used,
  usedBy: dbCode.used_by || undefined,
  usedAt: dbCode.used_at || undefined,
  createdAt: dbCode.created_at
});

export const mapDatabasePurchase = (dbPurchase: DatabasePurchase): Purchase => ({
  id: dbPurchase.id,
  clientId: dbPurchase.client_id,
  planId: dbPurchase.plan_id,
  codeId: dbPurchase.code_id,
  amount: dbPurchase.amount,
  pointsEarned: dbPurchase.points_earned,
  status: dbPurchase.status,
  createdAt: dbPurchase.created_at
});

// Map frontend objects to database objects
export const mapUserToDatabase = (user: Partial<User>): Partial<DatabaseUser> => ({
  id: user.id,
  name: user.name,
  email: user.email,
  type: user.type,
  points: user.points,
  created_at: user.createdAt
});

export const mapPlanToDatabase = (plan: Partial<Plan>): Partial<DatabasePlan> => ({
  id: plan.id,
  name: plan.name,
  description: plan.description,
  price: plan.price,
  duration: plan.duration,
  features: plan.features,
  points_reward: plan.pointsReward,
  is_active: plan.isActive,
  created_at: plan.createdAt
});

export const mapCodeToDatabase = (code: Partial<Code>): Partial<DatabaseCode> => ({
  id: code.id,
  plan_id: code.planId,
  code: code.code,
  is_used: code.isUsed,
  used_by: code.usedBy || null,
  used_at: code.usedAt || null,
  created_at: code.createdAt
});

export const mapPurchaseToDatabase = (purchase: Partial<Purchase>): Partial<DatabasePurchase> => ({
  id: purchase.id,
  client_id: purchase.clientId,
  plan_id: purchase.planId,
  code_id: purchase.codeId,
  amount: purchase.amount,
  points_earned: purchase.pointsEarned,
  status: purchase.status,
  created_at: purchase.createdAt
});