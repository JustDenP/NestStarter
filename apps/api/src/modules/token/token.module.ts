import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'entities/refresh-token.entity';

import { TokenRepository } from './token.repository';
import { TokenService } from './token.service';

@Module({
  imports: [MikroOrmModule.forFeature([RefreshToken]), UserModule],
  controllers: [],
  providers: [TokenService, TokenRepository, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
