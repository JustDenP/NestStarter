import { IS_PUBLIC_KEY_META } from '@common/@types/constants/metadata';
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';

import commonHandleRequest from './handleRequest';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY_META, context.getHandler());
    if (isPublic) return true;

    return super.canActivate(context);
  }

  handleRequest(error: any, user: any, info: any) {
    return commonHandleRequest(error, user, info);
  }
}
