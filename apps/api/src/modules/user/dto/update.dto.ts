import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateUserDTO } from './create-user.dto';

export class UpdateUserDTO extends PartialType(
  OmitType(CreateUserDTO, ['username', 'roles', 'email', 'password'] as const),
) {}
