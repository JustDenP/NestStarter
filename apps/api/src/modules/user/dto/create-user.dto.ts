import { Role } from '@common/@types/enums/roles.enum';
import { IsPassword } from '@common/decorators/validators/is-password.decorator';
import { IsUnique } from '@common/decorators/validators/is-unique.decorator';
import { MinMaxLength } from '@common/decorators/validators/min-max-length.decorator';
import { User } from '@entities';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export class CreateUserDTO {
  /**
   * Roles of user
   * @example "admin"
   */
  @IsEnum(Role)
  role: Role;

  /**
   * Email of user
   * @example justdenp@gmail.com
   */
  @IsUnique(() => User, 'email')
  @IsEmail()
  email: string;

  /**
   * Password of user
   * @example SomePassword@123
   */
  @IsString()
  @MinMaxLength({ minLength: 6, maxLength: 150 })
  @IsPassword()
  password: string;

  /**
   * First name of user
   * @example John
   */
  @IsString()
  @MinMaxLength({ minLength: 3, maxLength: 50 })
  firstName: string;

  /**
   * Last name of user
   * @example Doe
   */
  @IsString()
  @MinMaxLength({ minLength: 3, maxLength: 50 })
  lastName: string;
}
