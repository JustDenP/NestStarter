import { OmitType } from '@nestjs/swagger';

import { CreateUserDTO } from '../create-user.dto';

export class RegisterUserLocalDTO extends OmitType(CreateUserDTO, ['roles'] as const) {}

export class RegisterUserOAuthDTO extends OmitType(CreateUserDTO, ['password', 'roles'] as const) {}
