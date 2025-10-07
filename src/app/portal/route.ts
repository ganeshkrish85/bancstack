import { CustomerPortal } from "@polar-sh/nextjs";

export const GET = CustomerPortal({
	accessToken: process.env.POLAR_ACCESS_TOKEN!,
	getCustomerId: async () => "", // Fuction to resolve a Polar Customer ID
	server: (process.env.POLAR_SERVER as "production" | "sandbox") || "production",
});
