import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export default class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  override handleRequest(error: any, user: any, info: any) {
    if (error || info || !user) {
      if (info instanceof TokenExpiredError) {
        throw new ForbiddenException('The session has expired. Please login');
      } else if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Token malformed');
      } else {
        throw new UnauthorizedException('Unauthorized');
      }
    }

    return user;
  }
}
