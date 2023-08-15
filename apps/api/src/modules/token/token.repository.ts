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
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: BaseRepository<RefreshToken>,
    private readonly configService: ApiConfigService,
    private readonly em: EntityManager,
  ) {}

  async findTokenById(id: number): Promise<RefreshToken> {
    const token = await this.refreshTokenRepository.findOne({
      id,
      isActive: true,
    });
    if (!token) throw new NotFoundException();

    return token;
  }

  async createRefreshToken(user: User): Promise<RefreshToken> {
    const ttlSeconds = this.configService.getNumber('token.jwtRefreshExpirationTime'); // seconds
    const expiration = new Date();
    expiration.setTime(expiration.getTime() + ttlSeconds * 1000);

    const token = this.refreshTokenRepository.create({
      user: user.id,
      expiresIn: expiration,
    });
    await this.em.persistAndFlush(token);

    return token;
  }

  async deleteAllTokens(user: User): Promise<boolean> {
    await this.refreshTokenRepository.nativeUpdate(
      { user },
      { isActive: false, deletedAt: new Date() },
    );

    return true;
  }

  async deleteToken(user: User, tokenId: number): Promise<boolean> {
    await this.refreshTokenRepository.nativeUpdate(
      { user, id: tokenId },
      { isActive: false, deletedAt: new Date() },
    );

    return true;
  }
}
