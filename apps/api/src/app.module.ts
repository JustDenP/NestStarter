import { IsUniqueConstraint } from '@common/decorators/validators/is-unique.decorator';
import { StaticTimeoutInterceptor } from '@common/interceptors/static-timeout-handle.interceptor';
import { RealIpMiddleware } from '@common/middlewares/ip.middleware';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NestHttpModule } from '@modules/@lib/http.module';
import { NestPinoModule } from '@modules/@lib/pino';
import { AuthModule } from '@modules/auth/auth.module';
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
    HealthCheckerModule,
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
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RealIpMiddleware).forRoutes('/');
  }
}
