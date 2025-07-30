import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  organization_id?: string;
  avatar_url?: string;
  title?: string;
  department?: string;
  phone?: string;
  is_active?: boolean;
  last_login?: string;
  preferences?: any;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  isTrialMode: boolean;
  isDemoMode: boolean;
  trialDaysRemaining: number | null;
  signOut: () => Promise<void>;
  enableTrialMode: () => void;
  enableDemoMode: () => void;
  disableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  loading: true,
  isTrialMode: false,
  isDemoMode: false,
  trialDaysRemaining: null,
  signOut: async () => {},
  enableTrialMode: () => {},
  enableDemoMode: () => {},
  disableDemoMode: () => {},
});

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

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTrialMode, setIsTrialMode] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [trialDaysRemaining, setTrialDaysRemaining] = useState<number | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state change:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch to avoid deadlock
        if (session?.user) {
          setTimeout(async () => {
            try {
              const { data: profileData, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
              
              if (error) {
                console.error('Profile fetch error:', error);
              }
              setProfile(profileData);
            } catch (error) {
              console.error('Profile fetch failed:', error);
              setProfile(null);
            }
          }, 0);
        } else {
          setProfile(null);
        }
        
        setLoading(false);
      }
    );

    // Get initial session with timeout fallback
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('Initial session:', session?.user?.email, error);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();
            
            if (profileError) {
              console.error('Initial profile fetch error:', profileError);
            }
            setProfile(profileData);
          } catch (error) {
            console.error('Initial profile fetch failed:', error);
            setProfile(null);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Session initialization failed:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Fallback timeout to prevent infinite loading
    timeoutId = setTimeout(() => {
      console.warn('Auth initialization timeout, forcing loading to false');
      setLoading(false);
    }, 10000);

    return () => {
      subscription.unsubscribe();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Trial/Demo mode management
  const enableTrialMode = () => {
    setIsTrialMode(true);
    setIsDemoMode(false);
    setTrialDaysRemaining(14); // 14-day trial
    localStorage.setItem('titanis_trial_start', new Date().toISOString());
  };

  const enableDemoMode = () => {
    setIsDemoMode(true);
    setIsTrialMode(false);
    setTrialDaysRemaining(null);
    localStorage.setItem('titanis_demo_mode', 'true');
  };

  const disableDemoMode = () => {
    setIsDemoMode(false);
    localStorage.removeItem('titanis_demo_mode');
  };

  // Check trial/demo status on load
  useEffect(() => {
    const demoMode = localStorage.getItem('titanis_demo_mode');
    const trialStart = localStorage.getItem('titanis_trial_start');
    
    if (demoMode === 'true') {
      setIsDemoMode(true);
    } else if (trialStart) {
      const startDate = new Date(trialStart);
      const now = new Date();
      const daysDiff = Math.ceil((now.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const remaining = Math.max(0, 14 - daysDiff);
      
      if (remaining > 0) {
        setIsTrialMode(true);
        setTrialDaysRemaining(remaining);
      } else {
        // Trial expired
        localStorage.removeItem('titanis_trial_start');
        setIsTrialMode(false);
        setTrialDaysRemaining(null);
      }
    }
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error);
    }
    // Clear trial/demo states on sign out
    setIsTrialMode(false);
    setIsDemoMode(false);
    setTrialDaysRemaining(null);
    setProfile(null);
    localStorage.removeItem('titanis_trial_start');
    localStorage.removeItem('titanis_demo_mode');
  };

  const value = {
    user,
    session,
    profile,
    loading,
    isTrialMode,
    isDemoMode,
    trialDaysRemaining,
    signOut,
    enableTrialMode,
    enableDemoMode,
    disableDemoMode,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};