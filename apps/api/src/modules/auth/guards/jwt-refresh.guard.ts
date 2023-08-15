import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import commonHandleRequest from './handleRequest';

@Injectable()
export class JwtRefreshGuard extends AuthGuard('jwt-refresh-token') {
  handleRequest(error: any, user: any, info: any) {
    return commonHandleRequest(error, user, info);
  }
}
