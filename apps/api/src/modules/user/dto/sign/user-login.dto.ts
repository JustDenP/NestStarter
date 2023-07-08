import { IsPassword } from '@common/decorators/validators/is-password.decorator';
import { User } from '@entities';
import { PickType } from '@nestjs/swagger';

export class LoginUserDTO extends PickType(User, ['email'] as const) {
  @IsPassword()
  password?: string;
}
