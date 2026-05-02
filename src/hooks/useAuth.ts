import { useEffect, useState } from 'react';
import type { Session, User } from '@supabase/supabase-js';
import { supabase } from '../services/supabase';

interface AuthState {
  user: User | null;
  session: Session | null;
  role: 'admin' | 'customer' | null;
  loading: boolean;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    let mounted = true;

    async function getSession() {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) throw error;

        if (session?.user) {
          await fetchRole(session.user, session);
        } else {
          if (mounted) setAuthState({ user: null, session: null, role: null, loading: false });
        }
      } catch (error) {
        console.error('Error getting session:', error);
        if (mounted) setAuthState(prev => ({ ...prev, loading: false }));
      }
    }

    async function fetchRole(user: User, session: Session) {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user role:', error);
          if (mounted) setAuthState({ user, session, role: 'customer', loading: false });
        } else {
          if (mounted) setAuthState({ user, session, role: data?.role || 'customer', loading: false });
        }
      } catch (error) {
        console.error('Error in fetchRole:', error);
        if (mounted) setAuthState({ user, session, role: 'customer', loading: false });
      }
    }

    getSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          await fetchRole(session.user, session);
        } else {
          if (mounted) setAuthState({ user: null, session: null, role: null, loading: false });
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signIn = supabase.auth.signInWithPassword.bind(supabase.auth);
  
  const customSignUp = async (email: string, password: string, fullName: string) => {
    return await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });
  };

  const signOut = supabase.auth.signOut.bind(supabase.auth);

  return {
    ...authState,
    signIn,
    signUp: customSignUp,
    signOut,
  };
}
