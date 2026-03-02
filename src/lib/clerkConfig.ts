export const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined;

export const isClerkDevKey =
  typeof clerkPublishableKey === 'string' && clerkPublishableKey.startsWith('pk_test_');

export const isClerkEnabled =
  typeof clerkPublishableKey === 'string' &&
  clerkPublishableKey.length > 0 &&
  (!import.meta.env.PROD || !isClerkDevKey);

