import { Msgs } from '@common/@types/constants/messages';
import { Role } from '@common/@types/enums/roles.enum';
import { CryptUtils } from '@common/helpers/crypt';
import { User } from '@entities';
import { RequiredEntityData } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { TokenService } from '@modules/token/token.service';
import { RegisterUserDTO } from '@modules/user/dto/sign/user-register.dto';
import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';

import { UserLoginDTO } from './dto/user-login.dto';
import { AuthenticationResponse } from './types/auth-response';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: BaseRepository<User>,
    private readonly tokenService: TokenService,
    private readonly configService: ApiConfigService,
    private readonly em: EntityManager,
  ) {}

  async validateUser(isPasswordLogin: boolean, email: string, password?: string): Promise<User> {
    const user: User = await this.userRepository.findOne(
      {
        email,
        deletedAt: null,
      },
      {
        fields: ['*'],
      },
    );
    if (!user) throw new UnauthorizedException(Msgs.exception.wrongCredentials);
    if (!user.isActive) throw new ForbiddenException(Msgs.exception.inactiveUser);

    if (isPasswordLogin) {
      const isValid = await CryptUtils.validateHash(password, user.password);
      if (!isValid) throw new UnauthorizedException(Msgs.exception.wrongCredentials);
    }

    return user;
  }

  async login(
    credentials: UserLoginDTO,
    isPasswordLogin = true,
  ): Promise<AuthenticationResponse | any> {
    const user = await this.validateUser(isPasswordLogin, credentials.email, credentials.password);

    await this.userRepository.update(user, { lastLogin: new Date() });
    const accessToken = await this.tokenService.generateAccessToken(user);
    const refreshToken = await this.tokenService.generateRefreshToken(user);

    return [user, accessToken, refreshToken];
  }

  async register(data: RegisterUserDTO) {
    const user: RequiredEntityData<User> = {
      ...data,
      role: Role.USER,
      isActive: true,
    };

    const newUser = this.userRepository.create(user);
    await this.em.persistAndFlush(newUser);

    return this.userRepository.findById(newUser.id);
  }

  async logout(user: User, refreshToken: string): Promise<User> {
    const payload = await this.tokenService.decodeRefreshToken(refreshToken);

    return this.tokenService.deleteRefreshToken(user, payload);
  }

  async logoutFromAll(user: User): Promise<boolean> {
    return this.tokenService.deleteAllRefreshTokens(user);
  }

  public createCookieToken(token: string, type: 'Authentication' | 'Refresh'): string {
    return `${type}=${token}; HttpOnly; Path=/; Max-Age=${this.configService.getString(
      'token.jwtRefreshExpirationTime',
    )}`;
  }
}
