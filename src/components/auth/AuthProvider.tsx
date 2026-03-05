import React from 'react';

interface AuthProviderProps {
  children: React.ReactNode;
  routerPush?: (to: string) => void;
  routerReplace?: (to: string) => void;
}

// Legacy wrapper kept for backward compatibility.
// After migrating from Clerk to Auth0, this component is now a simple passthrough.
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  return <>{children}</>;
};

export default AuthProvider;
