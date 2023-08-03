import { ApiConfigService } from '@modules/@lib/config/config.service';
import { UserService } from '@modules/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ApiConfigService,
    private readonly authService: AuthService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getString('token.jwtSecret'),
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload;

    // Accept the JWT and attempt to validate it using the user service
    const user = await this.userService._findOne({ id: Number(sub) });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
