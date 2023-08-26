import { HelperService } from '@common/utils/helpers/helpers';
import { registerAs } from '@nestjs/config';

export const token = registerAs('token', () => ({
  jwtAccessExpirationTime: HelperService.isDev() ? 5 : 300,
  jwtRefreshExpirationTime: 5184000,
  jwtSecret: process.env.JWT_SECRET,
  otpExpirationTime: 5,
}));
