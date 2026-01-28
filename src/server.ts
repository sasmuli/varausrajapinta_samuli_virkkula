import Fastify from 'fastify';
import { registerRoutes } from './routes.js';
import { ErrorResponse } from './types.js';

export async function buildServer() {
  const app = Fastify({
    logger: true,
  });

  app.setErrorHandler((error, request, reply) => {
    app.log.error(error);
    
    reply.status(500).send({
      statusCode: 500,
      error: 'Internal Server Error',
      message: 'An unexpected error occurred',
    } as ErrorResponse);
  });

  await registerRoutes(app);

  return app;
}
