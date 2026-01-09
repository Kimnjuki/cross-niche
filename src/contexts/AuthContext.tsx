import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { supabase, isSupabaseConfigured } from '@/integrations/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleBookmark: (articleId: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert Supabase user to app User type
function mapSupabaseUserToUser(supabaseUser: SupabaseUser, metadata?: { name?: string }): User {
  return {
    id: supabaseUser.id,
    email: supabaseUser.email || '',
    name: metadata?.name || supabaseUser.user_metadata?.name || supabaseUser.email?.split('@')[0] || 'User',
    avatar: supabaseUser.user_metadata?.avatar_url,
    bookmarks: [],
    createdAt: supabaseUser.created_at || new Date().toISOString(),
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const initAuth = async () => {
      if (!isSupabaseConfigured()) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const appUser = mapSupabaseUserToUser(session.user, session.user.user_metadata);
          // Load bookmarks from Supabase
          const bookmarks = await loadBookmarks(session.user.id);
          setUser({ ...appUser, bookmarks });
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const appUser = mapSupabaseUserToUser(session.user, session.user.user_metadata);
        const bookmarks = await loadBookmarks(session.user.id);
        setUser({ ...appUser, bookmarks });
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Load bookmarks from Supabase
  const loadBookmarks = async (userId: string): Promise<string[]> => {
    if (!isSupabaseConfigured()) return [];

    try {
      const { data, error } = await supabase
        .from('user_bookmarks')
        .select('content_id')
        .eq('user_id', userId);

      if (error) throw error;
      return data?.map(b => b.content_id) || [];
    } catch (error) {
      console.error('Error loading bookmarks:', error);
      return [];
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured. Please check your environment variables.' };
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const appUser = mapSupabaseUserToUser(data.user, data.user.user_metadata);
        const bookmarks = await loadBookmarks(data.user.id);
        setUser({ ...appUser, bookmarks });
      }

      return { success: true };
    } catch (error: unknown) {
      const err = error as Error;
      return { success: false, error: err.message || 'An unexpected error occurred' };
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    if (!isSupabaseConfigured()) {
      return { success: false, error: 'Supabase is not configured. Please check your environment variables.' };
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        const appUser = mapSupabaseUserToUser(data.user, { name });
        setUser({ ...appUser, bookmarks: [] });
      }

      return { success: true };
    } catch (error: unknown) {
      const err = error as Error;
      return { success: false, error: err.message || 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
  };

  const toggleBookmark = async (articleId: string): Promise<void> => {
    if (!user || !isSupabaseConfigured()) return;

    try {
      // Check if bookmark exists
      const { data: existing } = await supabase
        .from('user_bookmarks')
        .select('id')
        .eq('user_id', user.id)
        .eq('content_id', articleId)
        .maybeSingle();

      if (existing) {
        // Remove bookmark
        const { error } = await supabase
          .from('user_bookmarks')
          .delete()
          .eq('id', existing.id);

        if (error) throw error;

        setUser({
          ...user,
          bookmarks: user.bookmarks.filter(id => id !== articleId),
        });
      } else {
        // Add bookmark
        const { error } = await supabase
          .from('user_bookmarks')
          .insert({
            user_id: user.id,
            content_id: articleId,
          });

        if (error) throw error;

        setUser({
          ...user,
          bookmarks: [...user.bookmarks, articleId],
        });
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, toggleBookmark }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}