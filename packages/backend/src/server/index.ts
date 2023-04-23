import fastify from 'fastify';
import path from 'path';
import { existsSync, readFileSync } from 'fs';
import cors from '@fastify/cors';
import session from '@fastify/secure-session';
import { $env } from '../utils/env.js';
import { __app, __root } from '../constants.js';
import { createSecret } from '../utils/index.js';
import { ControllerConfig } from '../utils/server.js';
import { sync as glob } from 'glob';
import { fastifyMultipart as multipart } from '@fastify/multipart';

// Constants
const ControllerPaths = [
  (process as any)[Symbol.for('ts-node.register.instance')]
    ? 'src/server/controllers/**/*.ts'
    : 'dist/server/controllers/**/*.js',
];

const SessionKeyPath = path.join(__app, '../../../../', '.session_key');

// Server

const $server = fastify({
  logger: {
    // Pretty printing log output in development
    transport: $env.dev ? { target: 'pino-pretty' } : undefined,
  },
});

$server.register(cors, {
  origin: $env('CORS_ORIGIN') ?? '*',
  credentials: true,
});

$server.register(multipart);

$server.register(async server => {
  const globPaths = ControllerPaths.map(path => glob(path.replace(/\\/g, '/'))).flat(1);
  const controllers: ControllerConfig[] = (
    await Promise.all(globPaths.map(pth => import(path.join(__root, pth)).then(module => module.default)))
  ).filter(val => !!val && typeof val === 'object');

  for (const { plugin, prefix } of controllers) {
    server.register(plugin, { prefix });
  }
});

if (!existsSync(SessionKeyPath)) {
  createSecret(SessionKeyPath);
}

$server.register(session, {
  cookieName: '_session',
  key: readFileSync(SessionKeyPath),
  cookie: {
    path: '/',
  },
});

export { $server };
