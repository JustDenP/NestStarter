import { Msgs } from '@common/@types/constants/messages';
import { IS_PUBLIC_KEY_META } from '@common/@types/constants/metadata';
import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY_META, context.getHandler());

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  handleRequest(error: any, user: any, info: any) {
    if (error || info || !user) {
      if (info instanceof TokenExpiredError) {
        throw new ForbiddenException(Msgs.exception.sessionExpired);
      } else if (info instanceof JsonWebTokenError) {
        throw new UnauthorizedException(Msgs.exception.tokenMalformed);
      } else {
        throw new UnauthorizedException(Msgs.exception.unauthorized);
      }
    }

    return user;
  }
}
