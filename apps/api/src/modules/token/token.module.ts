import { User } from '@entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { RefreshToken } from 'entities/refresh-token.entity';

import { TokenService } from './token.service';

@Module({
  imports: [MikroOrmModule.forFeature([User, RefreshToken]), JwtModule, UserModule],
  controllers: [],
  providers: [TokenService, JwtService],
  exports: [TokenService],
})
export class TokenModule {}
