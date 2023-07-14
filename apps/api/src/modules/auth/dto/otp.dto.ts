import { MinMaxLength } from '@common/decorators/validators/min-max-length.decorator';
import { PickType } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';

export class OtpVerifyDTO {
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

  /**
   * Email of user
   * @example someone@something.com
   */
  @IsEmail()
  email: string;
}

export class SendOtpDTO extends PickType(OtpVerifyDTO, ['email'] as const) {}
