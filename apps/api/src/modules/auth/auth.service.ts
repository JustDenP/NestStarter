import { Roles } from '@common/@types/enums/roles.enum';
import { CryptUtils } from '@common/helpers/crypt';
import { GeneratorUtils } from '@common/helpers/generator';
import { HelperService } from '@common/helpers/helpers';
import { User } from '@entities';
import { QueryOrder, RequiredEntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { TokenService } from '@modules/token/token.service';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import { UserService } from '@modules/user/user.service';
import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { isAfter } from 'date-fns';
import { Otp } from 'entities/otp.entity';

import { EmailDTO, OtpCodeDTO } from './dto/otp.dto';
import { ResetPasswordDTO } from './dto/reset-password.dto';
import { UserLoginDTO } from './dto/user-login.dto';
import { AuthenticationResponse } from './types/auth-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    public readonly userRepository: BaseRepository<User>,
    private readonly userService: UserService,
    @InjectRepository(Otp)
    private readonly otpRepository: BaseRepository<Otp>,
    private readonly tokenService: TokenService,
    private readonly configService: ApiConfigService,
    private readonly em: EntityManager,
  ) {}

  readonly msgs = {
    wrongCredentials: 'Invalid email or password. Please check your credentials and try again.',
    inactiveUser: 'You account has not been activated yet.',
    wrongOTP: 'Wrong code.',
    expiredOTP: 'The OTP code has expired. Please request a new code to proceed.',
    waitForNewOTP:
      "Please wait before requesting another OTP code. We have sent a code to your email. If you don't receive it within a few minutes, please check your spam folder.",
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
        isDeleted: false,
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
   * Register new user
   * @param data {@link RegisterUserDTO}
   * @returns User
   */
  public register(data: RegisterUserDTO) {
    const user: RequiredEntityData<User> = {
      ...data,
      roles: [Roles.CLIENT],
      isActive: true,
    };

    const newUser = this.userRepository.create(user);
    this.em.persistAndFlush(newUser);

    return this.userRepository.findOne(newUser);
  }

  /**
   * It creates a new OTP, sends it to the user's email, and returns the OTP
   * @param {EmailDTO} - email
   * @returns Promise<Otp>
   */
  async sendOtp(reqData: EmailDTO): Promise<Otp> {
    const { email } = reqData;
    const user = await this.userService._findOne({
      email,
    });

    /* Send another OTP only if latest is expired */
    const latestOtp = await this.otpRepository.findOne(
      { user },
      { orderBy: { createdAt: QueryOrder.DESC }, populate: false },
    );

    if (latestOtp) {
      /* Delete all previous OTPs for user whose timestamp is older than the latest entity */
      const oldOtps = await this.otpRepository.find({
        user,
        createdAt: { $lt: latestOtp.createdAt },
      });

      if (oldOtps.length >= 0) {
        await this.otpRepository.nativeDelete({
          id: { $in: oldOtps.map((entity) => entity.id) },
        });
      }

      /**
       * The time, when user can resend a new otp code
       * We get time of createdAt and add minutes to it
       * Then compare Date.now in UTC format with previous value
       */
      const minutesToResend = 2;
      const timeForResend = new Date(
        new Date(latestOtp.createdAt).getTime() + minutesToResend * 60 * 1000,
      );

      if (isAfter(timeForResend, new Date()))
        throw new HttpException(
          {
            statusCode: HttpStatus.TOO_MANY_REQUESTS,
            message: this.msgs.waitForNewOTP,
          },
          429,
        );
    }

    /* Generate and send new OTP code */
    const otpCode = GeneratorUtils.generateVerificationCode();
    const otp = this.otpRepository.create({
      user,
      otpCode,
      expiresIn: new Date(
        Date.now() + this.configService.getNumber('jwt.otpExpirationTime') * 60_000,
      ),
    });

    this.em.transactional(async (em) => {
      await em.persistAndFlush(otp);
      /* TODO Here we shoud send an email */

      if (HelperService.isDev) console.log('=========OTP CODE=========', otp.otpCode);
    });

    return otp;
  }

  /**
   * This function verifies an OTP code for user if the code is valid and not expired.
   * @param {OtpCodeDTO} code - Contains the OTP code that needs to be verified.
   * @returns Promise<Otp>
   */
  async verifyOtp(code: OtpCodeDTO): Promise<Otp> {
    const { otpCode } = code;

    const otp = await this.otpRepository.findOne(
      {
        otpCode,
        isActive: true,
        isDeleted: false,
      },
      { populate: ['user'] },
    );
    if (!otp) throw new NotFoundException(this.msgs.wrongOTP);

    const isExpired = isAfter(new Date(), new Date(otp.expiresIn));

    if (isExpired) {
      this.otpRepository.nativeUpdate(otp, {
        isActive: false,
      });

      throw new BadRequestException(this.msgs.expiredOTP);
    }

    this.otpRepository.assign(otp, {
      isActive: false,
    });

    return otp;
  }

  /**
   * We are finding the user details from the OTP table using the OTP code and then
   * updating the password of the user in the user table
   * @param {EmailDTO} reqData - OTP code and a new password
   * @returns Promise<User>
   */
  async resetPassword(reqData: ResetPasswordDTO): Promise<User> {
    const { password, otpCode } = reqData;
    const otp = await this.verifyOtp({ otpCode });

    const user = this.userRepository.assign(otp.user, { password });
    this.em.flush();

    return user;
  }

  /**
   * This function verifies an OTP code and updates the user's verification status if
   * the code is valid and not expired.
   * @param {OtpCodeDTO} code - Contains the OTP code that needs to be verified.
   * @returns Promise<User>
   */
  async verifyUser(code: OtpCodeDTO): Promise<User> {
    const otp = await this.verifyOtp(code);

    if (otp) {
      this.em.transactional(async (em) => {
        await Promise.all([
          em.nativeUpdate(
            User,
            {
              id: otp.user.id,
            },
            { isVerified: true },
          ),
          em.flush(),
        ]);
      });

      return otp.user;
    }
  }

  /**
   * It deletes all refresh tokens for a given user
   * @param {User} user - The user object that you want to logout from.
   * @returns Promise<boolian>
   */
  async logoutFromAll(user: User): Promise<boolean> {
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
