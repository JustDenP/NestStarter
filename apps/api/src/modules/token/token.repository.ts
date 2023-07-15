import { HelperService } from '@common/helpers/helpers';
import { User } from '@entities';
import { EntityManager } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import { RefreshToken } from 'entities/refresh-token.entity';

@Injectable()
export class TokenRepository {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: BaseRepository<RefreshToken>,
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
      isActive: true,
    });
    if (!token) throw new NotFoundException();

    return token;
  }

  /**
   * It creates a new refresh token for the given user and expiration time
   * @param {User} user - The user that the token is being created for.
   * @returns A refresh token
   */
  async createRefreshToken(user: User): Promise<RefreshToken> {
    const ttlSeconds = this.configService.getNumber('jwt.jwtRefreshExpirationTime'); // seconds
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttlSeconds * 1000);

    const token = this.refreshTokenRepository.create({
      user: user.id,
      expiresIn: expiration,
    });

    this.em.persistAndFlush(token);

    return this.refreshTokenRepository.findOne(token);
  }

  /**
   * It deletes all refresh tokens for a given user
   * @param {User} user - The user object that we want to delete the tokens for.
   * @returns A boolean value.
   */
  async deleteAllTokens(user: User): Promise<boolean> {
    this.refreshTokenRepository.nativeUpdate({ user }, { isActive: false });

    return true;
  }

  /**
   * It deletes a refresh token by setting its `isActive` property to `true`
   * @param {User} user - the user object that is currently logged in
   * @param {number} tokenId - The ID of the token to be deleted.
   * @returns A boolean value.
   */
  async deleteToken(user: User, tokenId: number): Promise<boolean> {
    this.refreshTokenRepository.nativeUpdate({ user, id: tokenId }, { isActive: false });

    return true;
  }
}
