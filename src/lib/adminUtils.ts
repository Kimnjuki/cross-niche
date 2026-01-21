/**
 * Admin utilities - Check if user is admin
 */

const ADMIN_EMAIL = 'kimnjuki2@gmail.com';

/**
 * Check if the current user is an admin
 */
export function isAdmin(userEmail: string | null | undefined): boolean {
  return userEmail === ADMIN_EMAIL;
}

/**
 * Get admin email
 */
export function getAdminEmail(): string {
  return ADMIN_EMAIL;
}



