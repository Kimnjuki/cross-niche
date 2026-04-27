import React, { createContext, useContext, useEffect, useState } from 'react';
import { useUser, useClerk } from '@clerk/clerk-react';
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
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut, openSignIn, openSignUp } = useClerk();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn || !clerkUser) {
      setUser(null);
      return;
    }
    const primaryEmail = clerkUser.primaryEmailAddress?.emailAddress ?? '';
    setUser({
      id: clerkUser.id,
      email: primaryEmail,
      name: clerkUser.fullName ?? clerkUser.firstName ?? primaryEmail ?? 'User',
      avatar: clerkUser.imageUrl ?? undefined,
      bookmarks: [],
      createdAt: clerkUser.createdAt?.toISOString() ?? new Date().toISOString(),
    });
  }, [clerkUser, isLoaded, isSignedIn]);

  const login = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      openSignIn({ afterSignInUrl: '/' });
      return { success: true };
    } catch (error) {
      console.error('Clerk login failed', error);
      return { success: false, error: 'Sign-in failed. Please try again.' };
    }
  };

  const signup = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      openSignUp({ afterSignUpUrl: '/' });
      return { success: true };
    } catch (error) {
      console.error('Clerk signup failed', error);
      return { success: false, error: 'Sign-up failed. Please try again.' };
    }
  };

  const logout = () => {
    signOut({ redirectUrl: '/' });
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
        isLoading: !isLoaded,
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
