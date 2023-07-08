import { User } from '@local/shared-models';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { UserService } from '../../user/user.service';
import { ApiConfigService } from '../../@lib/config/config.service';
import { TokenType } from '../types/constants/token-type.enum';
import { IRefreshTokenPayload } from '../types/interfaces/token-payload.dto';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(private configService: ApiConfigService, private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.config.get<string>('jwt.jwtSecret'),
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: IRefreshTokenPayload): Promise<User> {
    if (payload.type !== TokenType.REFRESH_TOKEN) {
      throw new UnauthorizedException('Token malformed');
    }

    const user = this.userService.findById(payload.sub);

    return user;
  }
}
