import { registerAs } from '@nestjs/config';

export const swagger = registerAs('swagger', () => ({
  enabled: true,
  title: 'Mu app',
  description: 'The nestjs API description',
  version: process.env.API_VERSION,
  path: 'api',
}));
