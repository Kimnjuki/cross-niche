import React from 'react';
import { ClerkProvider, ClerkLoaded, ClerkLoading } from '@clerk/clerk-react';
import { GlassCard } from '@/components/design-system/GlassCard';

interface AuthProviderProps {
  children: React.ReactNode;
  routerPush?: (to: string) => void;
  routerReplace?: (to: string) => void;
}

const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const AuthProvider: React.FC<AuthProviderProps> = ({ children, routerPush, routerReplace }) => {
  if (!clerkFrontendApi) {
    console.warn('Clerk publishable key not found. Authentication will be disabled.');
    return <>{children}</>;
  }

  return (
    <ClerkProvider
      publishableKey={clerkFrontendApi}
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
