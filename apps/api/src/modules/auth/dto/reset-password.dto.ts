import { IsEqualTo } from '@common/decorators/validators/is-equal-to.decorator';
import { IsPassword } from '@common/decorators/validators/is-password.decorator';
import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  /**
   * New password of user
   * @example SomeThingNew7^#%
   */
  @IsString()
  @IsPassword()
  password: string;

  /**
   * New password of user
   * @example AVeryGoodPassword@&67t75
   */
  @IsNotEmpty()
  @IsEqualTo('password')
  confirmPassword: string;
}

export class ChangePasswordDTO extends PickType(ResetPasswordDTO, [
  'password',
  'confirmPassword',
] as const) {
  /**
   * Password of user
   * @example SomeThingNew7^#%
   */
  @IsNotEmpty()
  oldPassword: string;
}
