import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { adminClient } from 'better-auth/client/plugins';
// import {
// genericOAuthClient,
// anonymousClient,
// emailOTPClient,
// magicLinkClient,
// twoFactorClient,
// } from 'better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  baseURL:
    typeof window !== 'undefined'
      ? `${window.location.origin}/api/auth`
      : `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth`,
  plugins: [convexClient(), adminClient()],
});
