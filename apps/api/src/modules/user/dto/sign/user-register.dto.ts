import { OmitType } from '@nestjs/swagger';

import { CreateUserDTO } from '../create-user.dto';

export class RegisterUserDTO extends OmitType(CreateUserDTO, ['roles'] as const) {}
