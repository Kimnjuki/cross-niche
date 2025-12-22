import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  toggleBookmark: (articleId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useLocalStorage<User | null>('media-platform-user', null);
  const [users, setUsers] = useLocalStorage<Record<string, { password: string; user: User }>>('media-platform-users', {});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const userRecord = users[email];
    if (!userRecord) {
      return { success: false, error: 'No account found with this email' };
    }
    if (userRecord.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }
    setUser(userRecord.user);
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    if (users[email]) {
      return { success: false, error: 'An account with this email already exists' };
    }
    const newUser: User = {
      id: crypto.randomUUID(),
      email,
      name,
      bookmarks: [],
      createdAt: new Date().toISOString(),
    };
    setUsers({ ...users, [email]: { password, user: newUser } });
    setUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const toggleBookmark = (articleId: string) => {
    if (!user) return;
    const newBookmarks = user.bookmarks.includes(articleId)
      ? user.bookmarks.filter(id => id !== articleId)
      : [...user.bookmarks, articleId];
    const updatedUser = { ...user, bookmarks: newBookmarks };
    setUser(updatedUser);
    setUsers({ ...users, [user.email]: { ...users[user.email], user: updatedUser } });
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
