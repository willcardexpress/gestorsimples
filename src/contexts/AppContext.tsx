import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Plan, Code, Purchase, AppContextType } from '../types';
import { supabase } from '../lib/supabase';
import { 
  mapDatabaseUser, mapDatabasePlan, mapDatabaseCode, mapDatabasePurchase,
  mapPlanToDatabase, mapCodeToDatabase, mapPurchaseToDatabase
} from '../utils/dbMappers';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [codes, setCodes] = useState<Code[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadUsers(),
        loadPlans(),
        loadCodes(),
        loadPurchases()
      ]);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Add refreshData function for explicit data refresh
  const refreshData = async () => {
    console.log('Refreshing all data from Supabase...');
    await loadAllData();
  };

  const loadUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading users:', error);
        return;
      }

      setUsers(data?.map(mapDatabaseUser) || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const loadPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('plans')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading plans:', error);
        return;
      }

      const mappedPlans = data?.map(mapDatabasePlan) || [];
      console.log('Loaded plans from Supabase:', mappedPlans.length);
      setPlans(mappedPlans);
    } catch (error) {
      console.error('Error loading plans:', error);
    }
  };

  const loadCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading codes:', error);
        return;
      }

      setCodes(data?.map(mapDatabaseCode) || []);
    } catch (error) {
      console.error('Error loading codes:', error);
    }
  };

  const loadPurchases = async () => {
    try {
      const { data, error } = await supabase
        .from('purchases')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading purchases:', error);
        return;
      }

      setPurchases(data?.map(mapDatabasePurchase) || []);
    } catch (error) {
      console.error('Error loading purchases:', error);
    }
  };

  const createPlan = async (planData: Omit<Plan, 'id' | 'createdAt'>): Promise<boolean> => {
    try {
      const dataToInsert = mapPlanToDatabase({
        ...planData,
        id: undefined, // Let Supabase generate the ID
        createdAt: new Date().toISOString()
      });

      console.log('Creating plan with data:', dataToInsert);

      const { data, error } = await supabase
        .from('plans')
        .insert(dataToInsert)
        .select()
        .single();

      if (error) {
        console.error('Error creating plan:', error);
        return false;
      }

      console.log('Plan created successfully:', data);

      // Update local state immediately
      const newPlan = mapDatabasePlan(data);
      setPlans(prev => [newPlan, ...prev]);

      // Force refresh to ensure synchronization
      setTimeout(() => {
        console.log('Refreshing data after plan creation...');
        refreshData();
      }, 1000);

      return true;
    } catch (error) {
      console.error('Error creating plan:', error);
      return false;
    }
  };

  const updatePlan = async (id: string, planData: Partial<Plan>): Promise<boolean> => {
    try {
      const dataToUpdate = mapPlanToDatabase(planData);
      
      const { data, error } = await supabase
        .from('plans')
        .update(dataToUpdate)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating plan:', error);
        return false;
      }

      // Update local state immediately
      const updatedPlan = mapDatabasePlan(data);
      setPlans(prev => prev.map(plan => plan.id === id ? updatedPlan : plan));

      // Force refresh to ensure synchronization
      setTimeout(() => {
        refreshData();
      }, 500);

      return true;
    } catch (error) {
      console.error('Error updating plan:', error);
      return false;
    }
  };

  const deletePlan = async (id: string): Promise<void> => {
    try {
      const { error } = await supabase
        .from('plans')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting plan:', error);
        return;
      }

      // Update local state immediately
      setPlans(prev => prev.filter(plan => plan.id !== id));
      setCodes(prev => prev.filter(code => code.planId !== id));

      // Force refresh to ensure synchronization
      setTimeout(() => {
        refreshData();
      }, 500);
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const addCodes = async (planId: string, newCodes: string[]): Promise<void> => {
    try {
      const codesToInsert = newCodes.map(code => ({
        plan_id: planId,
        code: code.trim(),
        is_used: false
      }));

      const { data, error } = await supabase
        .from('codes')
        .insert(codesToInsert)
        .select();

      if (error) {
        console.error('Error adding codes:', error);
        return;
      }

      // Update local state immediately
      const mappedCodes = data?.map(mapDatabaseCode) || [];
      setCodes(prev => [...mappedCodes, ...prev]);

      // Force refresh to ensure synchronization
      setTimeout(() => {
        refreshData();
      }, 500);
    } catch (error) {
      console.error('Error adding codes:', error);
    }
  };

  const purchasePlan = async (clientId: string, planId: string): Promise<Purchase | null> => {
    try {
      // Get plan details
      const plan = plans.find(p => p.id === planId);
      if (!plan) {
        console.error('Plan not found:', planId);
        return null;
      }

      // Find available code
      const availableCode = codes.find(c => c.planId === planId && !c.isUsed);
      if (!availableCode) {
        console.error('No available codes for plan:', planId);
        return null;
      }

      // Mark code as used
      const { error: codeError } = await supabase
        .from('codes')
        .update({
          is_used: true,
          used_by: clientId,
          used_at: new Date().toISOString()
        })
        .eq('id', availableCode.id);

      if (codeError) {
        console.error('Error updating code:', codeError);
        return null;
      }

      // Create purchase record
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .insert({
          client_id: clientId,
          plan_id: planId,
          code_id: availableCode.id,
          amount: plan.price,
          points_earned: plan.pointsReward,
          status: 'completed'
        })
        .select()
        .single();

      if (purchaseError) {
        console.error('Error creating purchase:', purchaseError);
        return null;
      }

      // Update user points
      await updateUserPoints(clientId, plan.pointsReward);

      // Update local state
      const updatedCode = { 
        ...availableCode, 
        isUsed: true, 
        usedBy: clientId, 
        usedAt: new Date().toISOString() 
      };
      setCodes(prev => prev.map(c => c.id === availableCode.id ? updatedCode : c));

      const newPurchase = mapDatabasePurchase(purchaseData);
      setPurchases(prev => [newPurchase, ...prev]);

      // Force refresh to ensure synchronization
      setTimeout(() => {
        refreshData();
      }, 500);

      return newPurchase;
    } catch (error) {
      console.error('Error purchasing plan:', error);
      return null;
    }
  };

  const updateUserPoints = async (userId: string, pointsToAdd: number): Promise<void> => {
    try {
      // Get current user points
      const currentUser = users.find(u => u.id === userId);
      if (!currentUser) {
        console.error('User not found:', userId);
        return;
      }

      const newPoints = currentUser.points + pointsToAdd;

      const { data, error } = await supabase
        .from('users')
        .update({ points: newPoints })
        .eq('id', userId)
        .select()
        .single();

      if (error) {
        console.error('Error updating user points:', error);
        return;
      }

      // Update local state
      const updatedUser = mapDatabaseUser(data);
      setUsers(prev => prev.map(u => u.id === userId ? updatedUser : u));

      // Update current user in localStorage if it's the same user
      const currentUserSession = localStorage.getItem('currentUser');
      if (currentUserSession) {
        try {
          const sessionUser = JSON.parse(currentUserSession);
          if (sessionUser.id === userId) {
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
          }
        } catch (error) {
          console.error('Error updating session user:', error);
        }
      }
    } catch (error) {
      console.error('Error updating user points:', error);
    }
  };

  const value: AppContextType = {
    users,
    plans,
    codes,
    purchases,
    loading,
    createPlan,
    updatePlan,
    deletePlan,
    addCodes,
    purchasePlan,
    updateUserPoints
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};