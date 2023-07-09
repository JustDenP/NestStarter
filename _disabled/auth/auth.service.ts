import { LoginUserDTO } from '@api/modules/app/user/dto/sign/user-login.dto';
import {
  RegisterUserLocalDTO,
  RegisterUserOAuthDTO,
} from '@api/modules/app/user/dto/sign/user-register.dto';
import { CryptUtils } from '@local/api-core';
import { User } from '@local/shared-models';
import { Roles } from '@local/shared-types';
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { ApiConfigService } from '../@lib/config/config.service';
import { UserService } from '../user/user.service';
import { AuthenticationStrategyType } from './types/constants/authentication-strategy-type.enum';
import { TokenType } from './types/constants/token-type.enum';
import type {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from './types/interfaces/token-payload.dto';

@Injectable()
export class AuthService {
  constructor(
    public readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
  ) {}

  /**
   * Create and register new user
   * @param inputData {@link CreateUserDTO}
   * @returns UserEntity
   */
  public async register(inputData: RegisterUserLocalDTO | RegisterUserOAuthDTO) {
    const userToCreate = {
      ...inputData,
      role: Roles.CLIENT,
      isActive: true,
    };

    return this.userService.create(userToCreate);
  }

  /**
   * Finds and validates user based on the selected strategy and data (email and/or password) and loggin him in.
   * @param strategy Plain or Oauth
   * @param userLoginData email and/or password
   * @returns User entity
   */
  public async signIn(strategy: AuthenticationStrategyType, userLoginData: LoginUserDTO) {
    const [, user] = await this.validateUser(strategy, userLoginData);

    return {
      user,
      accessToken: await this.createToken(user, TokenType.ACCESS_TOKEN),
      refreshToken: await this.createToken(user, TokenType.REFRESH_TOKEN),
    };
  }

  /**
   * Validates user based on the selected strategy and data (email and/or password)
   * @param strategy Plain or Oauth
   * @param userLoginData email and/or password
   * @param user {User}
   * @returns booliean
   */
  public async validateUser(
    strategy: AuthenticationStrategyType,
    userLoginData: LoginUserDTO,
  ): Promise<[boolean, User]> {
    const forbiddenMessage = 'User registred by external auth provider';

    try {
      const user = await this.userService.findOne({ email: userLoginData.email });

      if (strategy === AuthenticationStrategyType.PLAIN) {
        if (!user.password) {
          throw new HttpException(forbiddenMessage, HttpStatus.FORBIDDEN);
        }

        if (userLoginData.password && user.password) {
          const isPasswordMatching = await CryptUtils.validateHash(
            userLoginData.password,
            user.password,
          );
          if (!isPasswordMatching) throw new Error();
        }
      }

      return [true, user];
    } catch (error: any) {
      const { status } = error.response;

      if (status === 403) {
        throw new HttpException(forbiddenMessage, HttpStatus.FORBIDDEN);
      }

      throw new UnauthorizedException('Wrong credentials provided');
    }
  }

  /**
   * Create access token or refresh token
   * @param user - token payload
   * @param tokenType - Choose which token type to generate
   * @returns JWT signed string
   */
  async createToken(user: User, tokenType: TokenType): Promise<string> {
    if (tokenType === TokenType.ACCESS_TOKEN) {
      const payload: IAccessTokenPayload = {
        sub: user.id,
        roles: user.roles,
        type: tokenType,
      };

      return this.signAccessToken(payload);
    }

    const payload: IRefreshTokenPayload = {
      sub: user.id,
      type: tokenType,
    };

    return this.signRefreshToken(payload);
  }

  /**
   * Sign payload for access token
   * @param payload User payload
   * @returns JWT Access token string
   */
  async signAccessToken(payload: IAccessTokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: `${this.configService.config.get<string>('jwt.jwtAccessExpirationTime')}s`,
    });
  }

  /**
   * Sign payload for refresh token
   * @param payload User payload
   * @returns JWT Refresh token string
   */
  async signRefreshToken(payload: IRefreshTokenPayload) {
    return this.jwtService.signAsync(payload, {
      expiresIn: `${this.configService.config.get<string>('jwt.jwtRefreshExpirationTime')}s`,
    });
  }
}
