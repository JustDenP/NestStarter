import { Roles } from '@common/@types/enums/roles.enum';
import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiUnauthorizedResponse } from '@nestjs/swagger';

import { JwtAuthGuard } from '../guards/jwt.guard';
import { RolesGuard } from '../guards/roles.guard';

export function Auth(roles: Roles[] = []): MethodDecorator {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(JwtAuthGuard, RolesGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
