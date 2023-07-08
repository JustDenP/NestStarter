import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { Observable } from 'rxjs';

@Injectable()
export default class JwtAuthenticationGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  override canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>('isPublic', context.getHandler());

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  override handleRequest(error: unknown, user: any, info: unknown) {
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
