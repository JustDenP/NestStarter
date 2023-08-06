import { Msgs } from '@common/@types/constants/messages';
import { User } from '@entities';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { RefreshToken } from 'entities/refresh-token.entity';
import { JwtPayload, TokenExpiredError } from 'jsonwebtoken';

import { TokenRepository } from './token.repository';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: BaseRepository<User>,
    private readonly tokenRepository: TokenRepository,
    public readonly jwtService: JwtService,
    private readonly configService: ApiConfigService,
  ) {}

  private readonly BASE_OPTIONS: JwtSignOptions = {
    issuer: 'myapp',
    audience: 'myapp',
  };

  /**
   * Generate access token
   * @returns JWT signed string
   */
  async generateAccessToken(user: User): Promise<string> {
    const toPayload = {
      role: user.role,
    };
    const options: JwtSignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: this.configService.getNumber('token.jwtAccessExpirationTime'),
    };

    return this.jwtService.signAsync(toPayload, options);
  }

  /**
   * Generate refresh token
   * @returns JWT signed string
   */
  async generateRefreshToken(user: User): Promise<string> {
    const token = await this.tokenRepository.createRefreshToken(user);

    const options: JwtSignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: this.configService.getNumber('token.jwtRefreshExpirationTime'),
      jwtid: String(token.id),
    };

    return this.jwtService.signAsync({}, options);
  }

  /**
   * Takes an encoded refresh token, decodes it, finds
   * the user and token in the database, and returns them
   * @returns An object with a user and a token.
   */
  async resolveRefreshToken(encoded: string): Promise<{ user: User; token: RefreshToken }> {
    const decoded = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(decoded);

    if (!token) throw new UnauthorizedException(Msgs.exception.tokenNotFound);
    if (!token.isActive) throw new UnauthorizedException(Msgs.exception.tokenRevoked);

    const user = await this.getUserFromRefreshTokenPayload(decoded);
    if (!user) throw new UnauthorizedException(Msgs.exception.tokenMalformed);

    return { user, token };
  }

  /**
   * Takes a refresh token, resolves it to a user, and then
   * generates an access token for that user
   * @returns { token: string; user: User }
   */
  async createAccessTokenFromRefreshToken(refresh: string): Promise<{ token: string; user: User }> {
    const { user } = await this.resolveRefreshToken(refresh);
    const token = await this.generateAccessToken(user);

    return { token, user };
  }

  /**
   * Decode refresh token and throws an error if the token is expired or malformed
   * @returns JwtPayload
   */
  decodeRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      throw error instanceof TokenExpiredError
        ? new UnauthorizedException(Msgs.exception.sessionExpired)
        : new UnauthorizedException(Msgs.exception.tokenMalformed);
    }
  }

  /**
   * Take a refresh token payload, extracts the token ID from it, and then
   * uses that token ID to find the corresponding refresh token in the database
   * @returns Promise<RefreshToken>
   */
  async getStoredTokenFromRefreshTokenPayload(payload: JwtPayload): Promise<RefreshToken> {
    const tokenId = payload.jti;
    if (!tokenId) throw new UnauthorizedException(Msgs.exception.tokenMalformed);

    return this.tokenRepository.findTokenById(Number(tokenId));
  }

  /**
   * Take a refresh token payload, extracts the user ID from it, and then returns the user
   * @returns User
   */
  async getUserFromRefreshTokenPayload(payload: JwtPayload): Promise<User> {
    const subId = payload.sub;

    if (!subId) throw new UnauthorizedException(Msgs.exception.tokenMalformed);

    return this.userRepository.findById(Number(subId));
  }

  /**
   * Delete all the refresh token for the given user
   * @returns Promise<boolean>.
   */
  async deleteAllRefreshTokens(user: User): Promise<boolean> {
    return this.tokenRepository.deleteAllTokens(user);
  }

  /**
   * Delete the refresh token from the database and returns the user
   * @returns User
   */
  async deleteRefreshToken(user: User, payload: JwtPayload): Promise<User> {
    const tokenId = payload.jti;
    if (!tokenId) throw new UnauthorizedException(Msgs.exception.tokenMalformed);

    await this.tokenRepository.deleteToken(user, Number(tokenId));

    return user;
  }
}
