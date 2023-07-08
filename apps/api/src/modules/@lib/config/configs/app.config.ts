import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => ({
  env: process.env.NODE_ENV,
  port: Number(process.env.SERVER_PORT),
  url: process.env.URL,
  api_version: process.env.API_VERSION,
  isCors: true,
  allowedHosts: '*',
}));
