import { HelperService } from '@common/helpers/helpers';
import { registerAs } from '@nestjs/config';

export const token = registerAs('token', () => ({
  jwtAccessExpirationTime: HelperService.isDev() ? 1800 : 120,
  jwtRefreshExpirationTime: 5184000,
  jwtSecret: process.env.JWT_SECRET,
  otpExpirationTime: 5,
}));
