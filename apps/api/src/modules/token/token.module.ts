import { NestJwtModule } from '@modules/@lib/jwt.module';
import { Module } from '@nestjs/common';

import { TokenRepository } from './token.repository';
import { TokenService } from './token.service';

@Module({
  imports: [NestJwtModule],
  controllers: [],
  providers: [TokenService, TokenRepository],
  exports: [TokenService],
})
export class TokenModule {}
