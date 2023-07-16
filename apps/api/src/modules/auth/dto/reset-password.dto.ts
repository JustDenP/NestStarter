import { IsEqualTo } from '@common/decorators/validators/is-equal-to.decorator';
import { IsPassword } from '@common/decorators/validators/is-password.decorator';
import { MinMaxLength } from '@common/decorators/validators/min-max-length.decorator';
import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ResetPasswordDTO {
  /**
   * Otp code sent on email
   * @example 986579
   */
  @IsString()
  @MinMaxLength({
    minLength: 6,
    maxLength: 6,
  })
  otpCode: string;

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
