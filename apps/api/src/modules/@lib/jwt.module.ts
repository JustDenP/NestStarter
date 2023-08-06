import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ApiConfigModule } from './config/config.module';
import { ApiConfigService } from './config/config.service';

@Global()
@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ApiConfigModule],
      useFactory: async (configService: ApiConfigService) => ({
        secret: configService.getString('token.jwtSecret'),
        signOptions: {
          algorithm: 'HS256',
        },
        verifyOptions: {
          algorithms: ['HS256'],
        },
      }),
      inject: [ApiConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class NestJwtModule {}
