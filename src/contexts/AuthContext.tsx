import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { supabase } from '../lib/supabase';
import { mapDatabaseUser } from '../utils/dbMappers';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      setLoading(true);
      
      // Get initial session
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
      } else if (session?.user) {
        await handleAuthUser(session.user);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log('Auth state changed:', event, session?.user?.email);
          
          if (event === 'SIGNED_IN' && session?.user) {
            await handleAuthUser(session.user);
          } else if (event === 'SIGNED_OUT') {
            setUser(null);
            localStorage.removeItem('currentUser');
          }
        }
      );

      return () => {
        subscription.unsubscribe();
      };
    } catch (error) {
      console.error('Error initializing auth:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthUser = async (authUser: any) => {
    try {
      // Query the user profile from public.users table
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (error && error.code === 'PGRST116') {
        // User doesn't exist in public.users, create one
        const newUserData = {
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email!,
          type: (authUser.email === 'admin@iptv.com' ? 'admin' : 'client') as 'admin' | 'client',
          points: 0
        };

        const { data: createdUser, error: createError } = await supabase
          .from('users')
          .insert(newUserData)
          .select()
          .single();

        if (createError) {
          console.error('Error creating user profile:', createError);
          return;
        }

        const mappedUser = mapDatabaseUser(createdUser);
        setUser(mappedUser);
        localStorage.setItem('currentUser', JSON.stringify(mappedUser));
      } else if (error) {
        console.error('Error fetching user profile:', error);
      } else if (userProfile) {
        const mappedUser = mapDatabaseUser(userProfile);
        setUser(mappedUser);
        localStorage.setItem('currentUser', JSON.stringify(mappedUser));
      }
    } catch (error) {
      console.error('Error handling auth user:', error);
    }
  };

  const createAdminUser = async (): Promise<boolean> => {
    try {
      console.log('Creating admin user...');
      
      const { data, error } = await supabase.auth.signUp({
        email: 'admin@iptv.com',
        password: 'admin123',
        options: {
          data: {
            name: 'Administrator'
          }
        }
      });

      if (error) {
        console.error('Error creating admin user:', error);
        return false;
      }

      if (data.user) {
        console.log('Admin user created successfully');
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error creating admin user:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error.message);
        
        // If login fails for admin@iptv.com, try to create the admin user
        if (email === 'admin@iptv.com' && password === 'admin123' && error.message.includes('Invalid login credentials')) {
          console.log('Admin user not found, attempting to create...');
          
          const adminCreated = await createAdminUser();
          if (adminCreated) {
            // Wait a moment for the user to be fully created
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Try logging in again
            const { data: retryData, error: retryError } = await supabase.auth.signInWithPassword({
              email,
              password
            });

            if (retryError) {
              console.error('Retry login error:', retryError.message);
              return false;
            }

            if (retryData.user) {
              await handleAuthUser(retryData.user);
              return true;
            }
          }
        }
        
        return false;
      }

      if (data.user) {
        await handleAuthUser(data.user);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      // Attempt to sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Always clear local state regardless of server-side logout success
      // This ensures the client is in a consistent logged-out state
      setUser(null);
      localStorage.removeItem('currentUser');
    }
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (error) {
        console.error('Registration error:', error.message);
        return false;
      }

      if (data.user) {
        // The onAuthStateChange listener will handle creating the user profile
        return true;
      }

      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};