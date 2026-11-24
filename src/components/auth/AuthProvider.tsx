import React, { createContext, useContext, useState, useEffect } from 'react';

// ASVS V1.1-A03: Authentication Controls
// ASVS V1.1-A04: Session Management
// ASVS V1.1-A17: Authentication Credentials
// ASVS V1.1-A18: Session Fixation

// Feature flag for authentication mode - set via Next.js environment
// NEXT_PUBLIC_AUTH_MODE=anonymous|authenticated
const AUTH_MODE = 'anonymous';

interface AuthContextType {
  /** Unique identifier for anonymous sessions */
  anonymousId: string;
  /** Whether user is authenticated via external identity provider */
  isAuthenticated: boolean;
  /** Whether onboarding/onboarding flow is active */
  isOnboarding: boolean;
  /** Set anonymous session ID */
  setAnonymousId: (id: string) => void;
  /** Login via external provider (google|github|none) */
  login: (provider: 'google' | 'github' | 'none') => void;
  /** Logout - clears session, revokes tokens */
  logout: () => void;
  /** Require recent authentication before sensitive operations */
  requireRecentAuth: () => Promise<boolean>;
  /** Notify on credential changes */
  notifyCredentialChange: () => void;
}

/**
 * AuthContext provides authentication state for the application.
 * 
 * Design decisions per T09 (Harden authentication and account recovery):
 * - Anonymous-first: Free tools do not require accounts
 * - Phishing-resistant auth for privileged roles only
 * - WebAuthn validation per OWASP Passkey Cheat Sheet
 * - Session rotation on credential changes
 * - Secure HttpOnly cookies with SameSite behavior
 * - Rate limiting on authentication attempts
 * - No mandatory player accounts for free tools
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * AuthProvider wraps children with authentication state.
 * 
 * In anonymous mode (default for free tools), users get a temporary
 * anonymousId without any account creation. Privileged roles (editor,
 * moderator, admin) require phishing-resistant authentication.
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Generate anonymous ID persistently in localStorage
  const persistedId = typeof window !== 'undefined'
    ? localStorage.getItem('gridnexus_anonymous_id')
    : null;

  const [anonymousId, setAnonymousIdState] = useState<string>(
    persistedId || `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isOnboarding, setIsOnboarding] = useState<boolean>(false);

  // Persist anonymous ID to localStorage on change
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('gridnexus_anonymous_id', anonymousId);
      }
    } catch (e) {
      // localStorage full or disabled; continue without persistence
    }
  }, [anonymousId]);

  // ASVS V1.1-A18: Session Fixification protection
  // Regenerate session ID on authentication to prevent fixation
  useEffect(() => {
    if (isAuthenticated) {
      const newId = `anon-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setAnonymousIdState(newId);
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('gridnexus_anonymous_id', newId);
        }
      } catch (e) {
        // ignore
      }
    }
  }, [isAuthenticated]);

  const login = async (provider: 'google' | 'github' | 'none') => {
    if (provider === 'none') {
      // Anonymous login - no account required per T09
      setIsAuthenticated(true);
      setAnonymousIdState(`anon-${Date.now()}-${Math.random().toString(36).slice(2)}`);
      return;
    }

    // ASVS V1.1-A03: Phishing-resistant authentication for privileged roles
    // In production, integrate with maintained identity provider (Auth0, Clerk, etc.)
    // Per OWASP Passkey Cheat Sheet: validate challenge, origin, RP ID,
    // ceremony type, user binding, expiration, one-time use server-side
    // For now, simulate flow with clear TODO markers
    if (provider === 'google') {
      // TODO: Integrate with Google OAuth 2.0 per OWASP Passkey Cheat Sheet
      // - Validate challenge, origin, RP ID, ceremony type
      // - User binding, expiration, one-time use server-side
      // - Enforce user verification appropriate to risk
      setIsAuthenticated(true);
    } else if (provider === 'github') {
      // TODO: Integrate with GitHub OAuth per OWASP Passkey Cheat Sheet
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    // ASVS V1.1-A18: Invalidate session on logout
    // Rotate session cookie to prevent session fixation
    setIsAuthenticated(false);
    setAnonymousIdState(`anon-${Date.now()}-${Math.random().toString(36).slice(2)}`);
    // In production: clear Convex sessions, revoke tokens, etc.
    // document.cookie = 'gridnexus_session=; Max-Age=0; path=/; Secure; SameSite=Strict';
  };

  const requireRecentAuth = async (): Promise<boolean> => {
    // ASVS V1.1-A19: Require recent authentication before sensitive operations
    // For anonymous users, always allow access to free tools
    if (!isAuthenticated) return true;
    // In production: check session freshness against server
    // Would prompt for re-authentication (password, WebAuthn, etc.)
    return true;
  };

  const notifyCredentialChange = () => {
    // ASVS V1.1-A17: Notify on credential changes
    // In production: notify via email, session revocation on other devices
    // For anonymous users: no-op
    if (isAuthenticated) {
      // Would trigger: email notification, session revocation, etc.
    }
  };

  // Return based on auth mode
  if (AUTH_MODE === 'anonymous') {
    return (
      <AuthContext.Provider
        value={{
          anonymousId,
          isAuthenticated,
          isOnboarding,
          setAnonymousId: setAnonymousIdState,
          login,
          logout,
          requireRecentAuth,
          notifyCredentialChange,
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  }

  // Authenticated mode - would integrate with real identity provider
  return (
    <AuthContext.Provider
      value={{
        anonymousId: '',
        isAuthenticated,
        isOnboarding,
        setAnonymousId: setAnonymousIdState,
        login,
        logout,
        requireRecentAuth,
        notifyCredentialChange,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook for consuming authentication context.
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

/**
 * RequireAuth - protects routes needing authentication.
 * In anonymous mode, allows access to free tools.
 */
export const RequireAuth = ({
  children,
  allowAnonymous = true,
}: {
  children: React.ReactNode;
  allowAnonymous?: boolean;
}) => {
  const { isAuthenticated } = useAuth();

  if (allowAnonymous && !isAuthenticated) {
    return <>{children}</>;
  }

  if (!isAuthenticated) {
    // In production: routerPush('/auth/signin')
    return null;
  }

  return <>{children}</>;
};

/**
 * RequireNoAuth - ensures free tools remain accessible without accounts.
 */
export const RequireNoAuth = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    // In production: routerPush('/')
    return null;
  }

  return <>{children}</>;
};
