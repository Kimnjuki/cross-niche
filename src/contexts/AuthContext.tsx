import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useClerk, useUser } from '@clerk/clerk-react';

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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user: clerkUser, isLoaded } = useUser();
  const clerk = useClerk();

  useEffect(() => {
    if (!isLoaded) {
      setIsLoading(true);
      return;
    }

    if (!clerkUser) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ??
      clerkUser.emailAddresses?.[0]?.emailAddress ??
      '';
    const name = clerkUser.fullName ?? clerkUser.firstName ?? email ?? 'User';

    setUser({
      id: clerkUser.id,
      email,
      name,
      avatar: clerkUser.imageUrl ?? undefined,
      bookmarks: [],
      createdAt: clerkUser.createdAt ? new Date(clerkUser.createdAt).toISOString() : new Date().toISOString(),
    });
    setIsLoading(false);
  }, [clerkUser, isLoaded]);

  const login = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: AUTH_UNAVAILABLE };
  };

  const signup = async (): Promise<{ success: boolean; error?: string }> => {
    return { success: false, error: AUTH_UNAVAILABLE };
  };

  const logout = () => {
    void clerk.signOut();
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
