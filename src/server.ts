import Fastify from 'fastify';
import { registerRoutes } from './routes.js';

export async function buildServer() {
  const app = Fastify({
    logger: true,
  });

  await registerRoutes(app);

  return app;
}
