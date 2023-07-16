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

  readonly msgs = {
    malformed: 'Refresh token malformed!. Please login again!',
    expired: 'Refresh token expired!. Please login again!',
    notFound: 'Refresh token not found!. Please login again!',
    revoked: 'Refresh token revoked!. Please login again!',
  };

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
      expiresIn: this.configService.getNumber('jwt.jwtAccessExpirationTime'),
    };

    return this.jwtService.signAsync(toPayload, options);
  }

  /**
   * It creates a refresh token in the database, then signs it with JWT
   * @param {User} user - User - The user object that we want to generate a token for.
   * @returns JWT signed string
   */
  async generateRefreshToken(user: User): Promise<string> {
    const token = await this.tokenRepository.createRefreshToken(user);

    const options: JwtSignOptions = {
      ...this.BASE_OPTIONS,
      subject: String(user.id),
      expiresIn: this.configService.getNumber('jwt.jwtRefreshExpirationTime'),
      jwtid: String(token.id),
    };

    return this.jwtService.signAsync({}, options);
  }

  /**
   * It takes an encoded refresh token, decodes it, finds the user and token in the database, and
   * returns them
   * @param {string} encoded - string - The encoded refresh token
   * @returns An object with a user and a token.
   */
  async resolveRefreshToken(encoded: string): Promise<{ user: User; token: RefreshToken }> {
    const decoded = await this.decodeRefreshToken(encoded);
    const token = await this.getStoredTokenFromRefreshTokenPayload(decoded);

    if (!token) throw new UnauthorizedException(this.msgs.notFound);
    if (!token.isActive) throw new UnauthorizedException(this.msgs.revoked);

    const user = await this.getUserFromRefreshTokenPayload(decoded);
    if (!user) throw new UnauthorizedException(this.msgs.malformed);

    return { user, token };
  }

  /**
   * It takes a refresh token, resolves it to a user, and then generates an access token for that user
   * @param {string} refresh - string - The refresh token that was sent to the client.
   * @returns { token: string; user: User }
   */
  async createAccessTokenFromRefreshToken(refresh: string): Promise<{ token: string; user: User }> {
    const { user } = await this.resolveRefreshToken(refresh);
    const token = await this.generateAccessToken(user);

    return { token, user };
  }

  /**
   * It decodes the refresh token and throws an error if the token is expired or malformed
   * @param {string} token - The refresh token to decode.
   * @returns The payload of the token.
   */
  decodeRefreshToken(token: string): Promise<JwtPayload> {
    try {
      return this.jwtService.verifyAsync(token);
    } catch (error) {
      throw error instanceof TokenExpiredError
        ? new UnauthorizedException(this.msgs.expired)
        : new UnauthorizedException(this.msgs.malformed);
    }
  }

  /**
   * It takes a refresh token payload, extracts the token ID from it, and then uses that token ID to
   * find the corresponding refresh token in the database
   * @param {JwtPayload} payload - IJwtPayload
   * @returns Promise<RefreshToken>
   */
  async getStoredTokenFromRefreshTokenPayload(payload: JwtPayload): Promise<RefreshToken> {
    const tokenId = payload.jti;
    if (!tokenId) throw new UnauthorizedException(this.msgs.malformed);

    return this.tokenRepository.findTokenById(Number(tokenId));
  }

  /**
   * It takes a refresh token payload, extracts the user ID from it, and then returns the user
   * @param {JwtPayload} payload - IJwtPayload
   * @returns User
   */
  async getUserFromRefreshTokenPayload(payload: JwtPayload): Promise<User> {
    const subId = payload.sub;

    if (!subId) throw new UnauthorizedException(this.msgs.malformed);

    return this.userRepository.findOne({
      id: Number(subId),
    });
  }

  /**
   * It deletes all the refresh token for the given user
   * @param {User} user - The user object that we want to delete the refresh token for.
   * @returns Promise<boolean>.
   */
  async deleteAllRefreshTokens(user: User): Promise<boolean> {
    return this.tokenRepository.deleteAllTokens(user);
  }

  /**
   * It deletes the refresh token from the database and returns the user
   * @param {User} user - The user object that was returned from the validateUser method.
   * @param {JwtPayload} payload - The payload of the refresh token.
   * @returns The user object
   */
  async deleteRefreshToken(user: User, payload: JwtPayload): Promise<User> {
    const tokenId = payload.jti;
    if (!tokenId) throw new UnauthorizedException(this.msgs.malformed);

    await this.tokenRepository.deleteToken(user, Number(tokenId));

    return user;
  }
}
