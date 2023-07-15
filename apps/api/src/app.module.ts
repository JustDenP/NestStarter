import { IsUniqueConstraint } from '@common/decorators/validators/is-unique.decorator';
import { HttpCacheInterceptor } from '@common/interceptors/cache.interceptor';
import { ClearCacheInterceptor } from '@common/interceptors/clear-cache.interceptor';
import { StaticTimeoutInterceptor } from '@common/interceptors/static-timeout-handle.interceptor';
import { RealIpMiddleware } from '@common/middlewares/ip.middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NestCacheModule } from '@modules/@lib/cache/cache.module';
import { NestHttpModule } from '@modules/@lib/http.module';
import { NestJwtModule } from '@modules/@lib/jwt.module';
import { NestPinoModule } from '@modules/@lib/pino';
import { AuthModule } from '@modules/auth/auth.module';
import { TokenModule } from '@modules/token/token.module';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { ApiConfigModule } from './modules/@lib/config/config.module';
import { getOrmConfig } from './modules/@lib/config/configs/database.config';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ApiConfigModule,
    NestPinoModule,
    MikroOrmModule.forRootAsync({
      imports: [ApiConfigModule],
      useFactory: () => getOrmConfig(false),
    }),
    NestHttpModule,
    NestCacheModule,
    HealthCheckerModule,
    NestJwtModule,
    TokenModule,
    AuthModule,
    UserModule,
  ],
  controllers: [],
  providers: [
    IsUniqueConstraint,
    {
      provide: APP_INTERCEPTOR,
      useClass: StaticTimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClearCacheInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RealIpMiddleware).forRoutes('/');
  }
}
