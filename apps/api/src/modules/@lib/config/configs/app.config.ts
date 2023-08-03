import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => ({
  port: Number(process.env.SERVER_PORT),
  baseUrl: process.env.URL,
  apiVersion: process.env.API_VERSION,
  isCors: true,
  allowedHosts: '*',
}));
