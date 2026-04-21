import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
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
    user: auth0User,
    isLoading: auth0Loading,
    isAuthenticated,
    loginWithRedirect,
    logout: auth0Logout,
  } = useAuth0();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || auth0Loading) {
      setIsLoading(true);
      return;
    }

    if (!isAuthenticated || !auth0User) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    const email =
      (auth0User.email as string | undefined) ??
      (Array.isArray(auth0User.emails) ? (auth0User.emails[0] as string | undefined) : undefined) ??
      '';
    const name =
      (auth0User.name as string | undefined) ??
      (auth0User.given_name as string | undefined) ??
      email ??
      'User';

    setUser({
      id: (auth0User.sub as string | undefined) ?? email ?? 'user',
      email,
      name,
      avatar: (auth0User.picture as string | undefined) ?? undefined,
      bookmarks: [],
      createdAt: new Date().toISOString(),
    });
    setIsLoading(false);
  }, [auth0User, auth0Loading, isAuthenticated, isClient]);

  const login = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await loginWithRedirect();
      return { success: true };
    } catch (error) {
      console.error('Auth0 login failed', error);
      return { success: false, error: 'Sign-in failed. Please try again.' };
    }
  };

  const signup = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        },
      });
      return { success: true };
    } catch (error) {
      console.error('Auth0 signup failed', error);
      return { success: false, error: 'Sign-up failed. Please try again.' };
    }
  };

  const logout = () => {
    auth0Logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
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
