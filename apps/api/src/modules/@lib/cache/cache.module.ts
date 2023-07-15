import { CacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ApiConfigModule } from '../config/config.module';
import { ApiConfigService } from '../config/config.service';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.registerAsync<any>({
      imports: [ApiConfigModule],
      isGlobal: true,
      useFactory: async (configService: ApiConfigService) =>
        // const store = await redisStore({
        //   url: configService.getString('redis.url'),
        //   database: 0,
        //   isolationPoolOptions: {
        //     min: 1,
        //     max: 10,
        //   },
        // });

        ({
          // store: store as unknown as CacheStore,
          // ttl: configService.getNumber('redis.ttl'), // (milliseconds)
          ttl: 3000, // (milliseconds)
        }),
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule, CacheService],
  providers: [CacheService],
})
export class NestCacheModule {}
