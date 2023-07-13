import { registerAs } from '@nestjs/config';

import { NodeEnv } from '../node-env.enum';

export const jwt = registerAs('jwt', () => ({
  jwtAccessExpirationTime: process.env.NODE_ENV === NodeEnv.Development ? 1800 : 120,
  jwtRefreshExpirationTime: 5184000,
  jwtSecret: process.env.JWT_SECRET,
}));
