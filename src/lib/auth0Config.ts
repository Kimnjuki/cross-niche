export const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN as string | undefined;
export const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID as string | undefined;
export const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE as string | undefined;

export const isAuth0Enabled =
  typeof auth0Domain === 'string' &&
  auth0Domain.length > 0 &&
  typeof auth0ClientId === 'string' &&
  auth0ClientId.length > 0;

