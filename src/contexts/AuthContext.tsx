import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleBookmark: (articleId: string) => Promise<void>;
  resetPassword: (email: string) => Promise<{ success: boolean; error?: string }>;
  updatePassword: (newPassword: string) => Promise<{ success: boolean; error?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  signInWithGitHub: () => Promise<{ success: boolean; error?: string }>;
  resendVerificationEmail: () => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_UNAVAILABLE = 'Sign-in is not available.';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const {
    user: clerkUser,
    isLoaded: clerkLoaded,
    isSignedIn,
  } = useUser();
  const { signOut: clerkSignOut } = useClerkAuth();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !clerkLoaded) {
      setIsLoading(true);
      return;
    }

    if (!isSignedIn || !clerkUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const email = clerkUser.primaryEmailAddress?.emailAddress ?? '';
    const name = clerkUser.fullName ?? clerkUser.firstName ?? email ?? 'User';

    setUser({
      id: clerkUser.id ?? email ?? 'user',
      email,
      name,
      avatar: clerkUser.imageUrl ?? undefined,
      bookmarks: [],
      createdAt: new Date().toISOString(),
    });
    setIsLoading(false);
  }, [clerkUser, clerkLoaded, isSignedIn, isClient]);

  const login = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: 'Use the Clerk UI to sign in.' };
  };

  const signup = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: 'Use the Clerk UI to sign up.' };
  };

  const logout = () => {
    clerkSignOut();
    setUser(null);
  };

  const toggleBookmark = async (): Promise<void> => {};

  const resetPassword = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: AUTH_UNAVAILABLE };
  };

  const updatePassword = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: AUTH_UNAVAILABLE };
  };

  const signInWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: AUTH_UNAVAILABLE };
  };

  const signInWithGitHub = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: AUTH_UNAVAILABLE };
  };

  const resendVerificationEmail = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: AUTH_UNAVAILABLE };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        signup,
        logout,
        toggleBookmark,
        resetPassword,
        updatePassword,
        signInWithGoogle,
        signInWithGitHub,
        resendVerificationEmail,
      }}
    >
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
