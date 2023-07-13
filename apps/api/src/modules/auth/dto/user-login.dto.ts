import { CreateUserDTO } from '@modules/user/dto/create-user.dto';
import { PickType } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class UserLoginDTO extends PickType(CreateUserDTO, ['password'] as const) {
  /**
   * Email of user
   * @example justdenp@gmail.com
   */
  @IsEmail()
  email: string;
}
