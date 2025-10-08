import { httpRouter } from 'convex/server';
import { createAuth } from '@/lib/auth';
import { betterAuthComponent } from './auth';
import { autumn } from './autumn';

const http = httpRouter();

betterAuthComponent.registerRoutes(http, createAuth);

export default http;