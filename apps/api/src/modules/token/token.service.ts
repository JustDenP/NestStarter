import { User } from '@entities';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { Injectable } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';

import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {
  constructor(
    private readonly tokenRepository: TokenRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
  ) {}

  private readonly BASE_OPTIONS: JwtSignOptions = {
    issuer: 'myapp',
    audience: 'myapp',
  };

  /**
   * Generate access token or refresh token
   * @param user - Omit<User, "password">
   * @param tokenType - Choose which token type to generate {@link TokenType}
   * @returns JWT signed string
   */
  async generateAccessToken(user: Omit<User, 'password'>): Promise<string> {
    const toPayload = {
      roles: user.roles,
    };
    const options: JwtSignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: `${this.configService.getNumber('jwt.jwtAccessExpirationTime')}s`,
    };

    return this.jwtService.signAsync(toPayload, options);
  }

  /**
   * It creates a refresh token in the database, then signs it with JWT
   * @param {User} user - User - The user object that we want to generate a token for.
   * @returns JWT signed string
   */
  generateRefreshToken(user: User): Promise<string> {
    const token = this.tokenRepository.createRefreshToken(user);

    const options: JwtSignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: String(token.expiresIn),
      jwtid: String(token.id),
    };

    return this.jwtService.signAsync({}, options);
  }
}
