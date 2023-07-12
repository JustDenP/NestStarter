import { User } from '@entities';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RefreshToken } from 'entities/refresh-token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: EntityRepository<RefreshToken>,
    private readonly configService: ApiConfigService,
  ) {}

  /**
   * It finds a refresh token by its id and returns it
   * @param {number} id - The id of the token to be found.
   * @returns Promise<RefreshToken>
   */
  async findTokenById(id: number): Promise<RefreshToken> {
    const token = await this.refreshTokenRepository.findOne({
      id,
      isRevoked: false,
    });
    if (!token) throw new NotFoundException();

    return token;
  }

  /**
   * It creates a new refresh token for the given user and expiration time
   * @param {User} user - The user that the token is being created for.
   * @returns A refresh token
   */
  createRefreshToken(user: User): RefreshToken {
    const expiration = new Date();
    const ttlSeconds = this.configService.getNumber('jwt.jwtRefreshExpirationTime'); // seconds
    expiration.setTime(expiration.getTime() + ttlSeconds);

    const token = this.refreshTokenRepository.create({
      user: user.id,
      expiresIn: expiration,
    });

    this.em.persistAndFlush(token);

    return token;
  }

  /**
   * It deletes all refresh tokens for a given user
   * @param {User} user - User - The user object that we want to delete the tokens for.
   * @returns A boolean value.
   */
  async deleteTokensForUser(user: User): Promise<boolean> {
    this.refreshTokenRepository.nativeUpdate({ user }, { isRevoked: true });

    return true;
  }

  /**
   * It deletes a refresh token by setting its `isRevoked` property to `true`
   * @param {User} user - User - the user object that is currently logged in
   * @param {number} tokenId - The ID of the token to be deleted.
   * @returns A boolean value.
   */
  async deleteToken(user: User, tokenId: number): Promise<boolean> {
    this.refreshTokenRepository.nativeUpdate({ user, id: tokenId }, { isRevoked: true });

    return true;
  }
}
