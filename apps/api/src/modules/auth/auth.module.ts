import { User } from '@entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { TokenModule } from '@modules/token/token.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { Otp } from 'entities/otp.entity';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';

@Module({
  imports: [MikroOrmModule.forFeature([User, Otp]), PassportModule, UserModule, TokenModule],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
