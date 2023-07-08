import { registerAs } from '@nestjs/config';

export const oauth = registerAs('oauth', () => ({
  googleOauthClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
  googleOauthClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
}));
