import React from 'react';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { GlassCard } from '@/components/design-system/GlassCard';
import { clerkPublishableKey, isClerkEnabled, isClerkDevKey } from '@/lib/clerkConfig';

interface AuthProviderProps {
  children: React.ReactNode;
  routerPush?: (to: string) => void;
  routerReplace?: (to: string) => void;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, routerPush, routerReplace }) => {
  if (!isClerkEnabled || !clerkPublishableKey) {
    if (!clerkPublishableKey) {
      console.warn('Clerk publishable key not found. Authentication will be disabled.');
    } else if (!import.meta.env.DEV && isClerkDevKey) {
      console.warn(
        'Clerk is configured with a development publishable key on a non-development host. Authentication UI is disabled until a production key is configured.'
      );
    }
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      routerPush={routerPush}
      routerReplace={routerReplace}
    >
      <ClerkLoading>
        <div className="min-h-screen flex items-center justify-center">
          <GlassCard className="p-8">
            <div className="animate-spin w-8 h-8 border-2 border-nexus-cyan border-t-transparent rounded-full"></div>
          </GlassCard>
        </div>
      </ClerkLoading>
      <ClerkLoaded>
        {children}
      </ClerkLoaded>
    </ClerkProvider>
  );
};

export default AuthProvider;
