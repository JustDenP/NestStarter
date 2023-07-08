import { Roles } from '@common/@types/enums/roles.enum';
import { IsPassword } from '@common/decorators/validators/is-password.decorator';
import { IsUnique } from '@common/decorators/validators/is-unique.decorator';
import { IsUsername } from '@common/decorators/validators/is-username.decorator';
import { MinMaxLength } from '@common/decorators/validators/min-max-length.decorator';
import { User } from '@entities';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { i18nValidationMessage } from 'nestjs-i18n';

export class CreateUserDTO {
  /**
   * Roles of user
   * @example ["ADMIN"]
   */
  @IsEnum(Roles, { each: true })
  roles: Roles[];

  /**
   * Username of user
   * @example abobus123
   */
  @IsUsername()
  @IsUnique(() => User, 'username')
  username: string;

  /**
   * Email of user
   * @example justdenp@gmail.com
   */
  @IsNotEmpty({ message: i18nValidationMessage('validation.isNotEmpty') })
  @IsUnique(() => User, 'email')
  @IsEmail(
    {},
    {
      message: i18nValidationMessage('validation.isValid'),
    },
  )
  email: string;

  /**
   * Password of user
   * @example SomePassword@123
   */
  @IsString()
  @MinMaxLength({ minLength: 6, maxLength: 50 })
  @IsPassword({ message: i18nValidationMessage('validation.isPassword') })
  password: string;

  /**
   * First name of user
   * @example John
   */
  @IsString()
  @MinMaxLength({ maxLength: 50 })
  firstName: string;

  /**
   * Last name of user
   * @example Doe
   */
  @IsString()
  @MinMaxLength({ maxLength: 50 })
  lastName: string;
}
