import { IS_PUBLIC_KEY_META } from '@common/@types/constants/metadata';
import { Roles } from '@common/@types/enums/roles.enum';
import { User } from '@entities';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Roles[]>('roles', context.getHandler());

    if (_.isEmpty(roles)) {
      return true;
    }

    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY_META, context.getHandler());

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = <User>request.user;

    return roles.some((r) => user.roles.includes(r));
  }
}
