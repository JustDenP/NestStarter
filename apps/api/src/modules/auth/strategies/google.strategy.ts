import { GeneratorUtils } from '@common/helpers/generator';
import { User } from '@entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import _ from 'lodash';
import type { Profile, VerifyCallback } from 'passport-google-oauth20';
import { Strategy } from 'passport-google-oauth20';

import { ApiConfigService } from '../../@lib/config/config.service';
import { AuthService } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-oauth') {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: BaseRepository<User>,
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      clientID: configService.getString('oauth.googleOauthClientId'),
      clientSecret: configService.getString('oauth.googleOauthClientSecret'),
      callbackURL: `${configService.getString('app.url')}auth/callback`,
      // state: true,
      // passReqToCallback: true,
      scope: ['email', 'profile'],
    });
  }

  async validate(
    accessToken: string,
    _refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { name, emails, photos, username } = profile;

    const userData = {
      email: emails[0].value,
      username: username ? username : emails[0].value.split('@')[0],
      isVerified: emails[0].verified,
      firstName: name.givenName,
      lastName: name.familyName,
      picture: photos[0].value,
      accessToken,
    };

    /* Here we choose whether to login user or register him  */
    const existingUser = await this.userRepository.findOne(
      { email: userData.email, deletedAt: null },
      {
        populate: true,
      },
    );

    if (existingUser) {
      done(null, existingUser);
    } else {
      const user: RegisterUserDTO = await this.authService.register({
        ..._.omit(userData, ['accessToken']),
        password: GeneratorUtils.generateRandomString(15),
      });
      done(null, user);
    }
  }
}
