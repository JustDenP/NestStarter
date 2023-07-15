import { ApiConfigService } from '@modules/@lib/config/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getString('jwt.jwtSecret'),
      ignoreExpiration: false,
    });
  }

  /**
   *
   * @description Validate the token and return the user
   * @param payload string
   * @returns User
   */
  async validate(payload: JwtPayload) {
    const { sub } = payload;

    // Accept the JWT and attempt to validate it using the user service
    const user = await this.authService.userRepository.findOne({ id: Number(sub) });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
