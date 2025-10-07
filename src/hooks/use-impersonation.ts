'use client';

import { authClient } from '@/lib/auth-client';

/**
 * Hook to detect if the current session is an impersonation session
 * Returns information about the impersonation status
 */
export function useImpersonation() {
  const { data: session } = authClient.useSession();

  console.log('useImpersonation - Full session:', JSON.stringify(session, null, 2));

  // The impersonatedBy field is in the session object itself, not nested
  // When an admin impersonates a user, the session becomes the user's session
  // but has an impersonatedBy field pointing to the admin's ID
  const impersonatedBy = (session?.session as { impersonatedBy?: string })?.impersonatedBy;
  const isImpersonating = !!impersonatedBy;

  console.log('useImpersonation - impersonatedBy:', impersonatedBy);
  console.log('useImpersonation - isImpersonating:', isImpersonating);

  return {
    isImpersonating,
    impersonatedBy: impersonatedBy || null,
    impersonatedUser: isImpersonating ? session?.user : null,
  };
}
