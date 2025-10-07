import { v } from 'convex/values';

import { createAuth } from '@/lib/auth';

import { mutation, query } from './_generated/server';
import { betterAuthComponent } from './auth';

// Query to list all users (complement to Better Auth's listUsers)
export const listAllUsers = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();
    return users;
  },
});

// Mutation to set a user's role
export const setUserRole = mutation({
  args: {
    userId: v.string(),
    role: v.union(v.literal('admin'), v.literal('user')),
  },
  handler: async (ctx, args) => {
    console.log('setUserRole called with userId:', args.userId);

    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);

    const result = await auth.api.setRole({
      body: {
        userId: args.userId,
        role: args.role,
      },
      headers,
    });

    return result;
  },
});

// Mutation to ban a user
export const banUser = mutation({
  args: {
    userId: v.string(),
    banReason: v.optional(v.string()),
    banExpiresIn: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);

    const result = await auth.api.banUser({
      body: {
        userId: args.userId,
        banReason: args.banReason,
        banExpiresIn: args.banExpiresIn,
      },
      headers,
    });

    return result;
  },
});

// Mutation to unban a user
export const unbanUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);

    const result = await auth.api.unbanUser({
      body: {
        userId: args.userId,
      },
      headers,
    });

    return result;
  },
});

// Mutation to remove a user
export const removeUser = mutation({
  args: {
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = createAuth(ctx);
    const headers = await betterAuthComponent.getHeaders(ctx);

    const result = await auth.api.removeUser({
      body: {
        userId: args.userId,
      },
      headers,
    });

    return result;
  },
});

// Query to get user statistics
export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query('users').collect();

    const totalUsers = users.length;
    const adminCount = users.filter((u) => (u as any).role === 'admin').length;
    const bannedCount = users.filter((u) => (u as any).banned === true).length;

    return {
      totalUsers,
      adminCount,
      bannedCount,
    };
  },
});
