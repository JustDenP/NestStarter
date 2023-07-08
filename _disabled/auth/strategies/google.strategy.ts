import { RegisterUserOAuthDTO } from '@api/modules/app/user/dto/sign/user-register.dto';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { VerifyCallback } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';

import { UserService } from '../../user/user.service';
import { ApiConfigService } from '../../@lib/config/config.service';
import { AuthService } from '../auth.service';
import { AuthenticationStrategyType } from '../types/constants/authentication-strategy-type.enum';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-oauth') {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {
    super({
      clientID: configService.config.get('oauth.googleOauthClientId'),
      clientSecret: configService.config.get('oauth.googleOauthClientSecret'),
      callbackURL: `${configService.config.get('app.url')}auth/callback`,
      // state: true,
      // passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    _accessToken: string,
    _refreshToken: string,
    profile,
    done: VerifyCallback,
  ): Promise<void> {
    const { emails, name, photos } = profile;

    const userData: RegisterUserOAuthDTO = {
      email: emails[0].value,
      username: emails[0].value.split('@')[0],
      isVerified: emails[0].verified,
      settings: {},
      profile: {
        firstName: name.givenName,
        lastName: name.familyName,
        avatar: photos[0].value,
      },
      // _accessToken,
    };

    console.dir(userData);

    /* Here we choose whether to login user or register him  */
    try {
      const user = await this.userService.findOne(
        { email: userData.email },
        {
          populate: true,
        },
      );

      await this.authService.validateUser(AuthenticationStrategyType.OAUTH, {
        email: userData.email,
      });

      done(null, user);
    } catch (error: any) {
      const { status } = error.response;

      if (status === 404) {
        const user = await this.authService.register(userData);
        done(null, user);
      }

      throw error;
    }
  }
}
