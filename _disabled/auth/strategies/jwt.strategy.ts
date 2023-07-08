import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { ApiConfigService } from '../../@lib/config/config.service';
import { IAccessTokenPayload } from '../types/interfaces/token-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ApiConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.config.get<string>('jwt.jwtSecret'),
      ignoreExpiration: false,
    });
  }

  validate(payload: IAccessTokenPayload) {
    /* We dont need to find user in DB for now, just use payload */

    const user = {
      id: payload.sub,
      role: payload.roles,
    };

    return user;
  }
}
