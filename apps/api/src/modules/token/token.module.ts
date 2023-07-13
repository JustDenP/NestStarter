import { User } from '@entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { RefreshToken } from 'entities/refresh-token.entity';

import { TokenRepository } from './token.repository';
import { TokenService } from './token.service';

@Module({
  imports: [MikroOrmModule.forFeature([User, RefreshToken])],
  controllers: [],
  providers: [TokenService, TokenRepository],
  exports: [TokenService],
})
export class TokenModule {}
