import { ApiConfigService } from '@modules/@lib/config/config.service';
import { TokenService } from '@modules/token/token.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly tokenService: TokenService,
    private readonly configService: ApiConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => request?.cookies?.Refresh]),
      secretOrKey: configService.getString('token.jwtSecret'),
      // passReqToCallback: true,
      ignoreExpiration: false,
    });
  }

  async validate(payload: JwtPayload) {
    const { sub } = payload;
    const user = await this.tokenService.getUserFromRefreshTokenPayload(payload);

    if (!user) throw new UnauthorizedException();

    return user;
  }
}
