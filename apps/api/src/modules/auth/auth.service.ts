import { CryptUtils } from '@common/helpers/crypt';
import { User } from '@entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { TokenService } from '@modules/token/token.service';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Otp } from 'entities/otp.entity';

import { UserLoginDTO } from './dto/user-login.dto';
import { AuthenticationResponse } from './types/auth-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: BaseRepository<User>,
    @InjectRepository(Otp)
    private readonly otpRepository: EntityRepository<Otp>,
    private readonly tokenService: TokenService,
  ) {}

  readonly msgs = {
    wrongCredentials: 'Invalid email or password. Please check your credentials and try again.',
    inactiveUser: 'You account has not been activated yet.',
  };

  /**
   * It takes an email and a password, and returns the user if the password is correct
   * @param {boolean} isPasswordLogin - boolean - This is a boolean value that determines
   * whether the user is logging in with a password or not.
   * @param {string} email - Email of the user.
   * @param {string} pass - The password to be validated
   * @returns The user object without the password property.
   */
  async validateUser(isPasswordLogin: boolean, email: string, password?: string): Promise<User> {
    const user: User = await this.userRepository.findOne(
      {
        email,
      },
      {
        fields: ['*'],
      },
    );
    if (!user) throw new UnauthorizedException(this.msgs.wrongCredentials);
    if (!user.isActive) throw new ForbiddenException(this.msgs.inactiveUser);

    if (isPasswordLogin) {
      const isValid = await CryptUtils.validateHash(password, user.password);
      if (!isValid) throw new UnauthorizedException(this.msgs.wrongCredentials);
    }

    return user;
  }

  /**
   * Validate the user, if the user is valid, we generate an access token and a refresh token
   * @param {UserLoginDTO} credentials - User's creadentials
   * @param {boolean} isPasswordLogin - This is a boolean value that tells the function whether
   * the user is logging in with a password or oauth
   * @returns A Promise of type IAuthenticationResponse
   */
  async login(credentials: UserLoginDTO, isPasswordLogin = true): Promise<AuthenticationResponse> {
    const user = await this.validateUser(isPasswordLogin, credentials.email, credentials.password);

    await this.userRepository.nativeUpdate({ id: user.id }, { lastLogin: new Date() });
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    return {
      user: {
        id: user.id,
      },
      accessToken: accessToken,
      ...(refreshToken ? { refresh_token: refreshToken } : {}),
    };
  }

  /**
   * It deletes all refresh tokens for a given user
   * @param {User} user - The user object that you want to logout from.
   * @returns Promise<boolian>
   */
  logoutFromAll(user: User): Promise<boolean> {
    return this.tokenService.deleteAllRefreshTokens(user);
  }

  /**
   * We decode the refresh token, then delete the refresh token from the database
   * @param {User} user - User - The user object that was returned from the login method.
   * @param {string} refreshToken - The refresh token that was sent to the client.
   * @returns Promise<User>
   */
  async logout(user: User, refreshToken: string): Promise<User> {
    const payload = await this.tokenService.decodeRefreshToken(refreshToken);

    return this.tokenService.deleteRefreshToken(user, payload);
  }
}
