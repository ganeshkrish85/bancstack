import { Checkout } from '@polar-sh/nextjs';

export const GET = Checkout({
  accessToken: process.env.POLAR_ACESSS_SANDBOX_TOKEN!,
  successUrl: process.env.SUCCESS_URL!,
  server: 'sandbox',
});
