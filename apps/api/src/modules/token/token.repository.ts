import { User } from '@entities';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ApiConfigService } from '@modules/@lib/config/config.service';
import { Injectable } from '@nestjs/common';
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
   * It creates a new refresh token for the given user and expiration time
   * @param {User} user - The user that the token is being created for.
   * @returns A refresh token
   */
  createRefreshToken(user: User): RefreshToken {
    const expiration = new Date();
    // the input is treated as millis so *1000 is necessary
    const ttlSeconds = this.configService.getNumber('jwt.jwtRefreshExpirationTime'); // seconds
    expiration.setTime(expiration.getTime() + ttlSeconds);

    const token = this.refreshTokenRepository.create({
      user: user.id,
      expiresIn: expiration,
    });

    this.em.persistAndFlush(token);

    return token;
  }
}
