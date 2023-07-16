import { MinMaxLength } from '@common/decorators/validators/min-max-length.decorator';
import { IsEmail, IsString } from 'class-validator';

export class OtpCodeDTO {
  /**
   * Otp sent on email
   * @example 986579
   */
  @IsString()
  @MinMaxLength({
    minLength: 6,
    maxLength: 6,
  })
  otpCode: string;
}

export class EmailDTO {
  /**
   * Email of user
   * @example someone@something.com
   */
  @IsEmail()
  email: string;
}
