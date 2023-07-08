import { Roles } from '@local/shared-types';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

import JwtAuthenticationGuard from '../guards/jwt-authentication.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(roles: Roles[] = []): MethodDecorator {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthenticationGuard, RolesGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
