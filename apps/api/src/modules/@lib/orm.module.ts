import * as Entities from '@entities';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { defineConfig } from '@mikro-orm/postgresql';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiConfigService } from './config/config.service';
import { baseOptions } from './config/configs/database.config';

@Global()
@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ApiConfigService) =>
        defineConfig({
          ...baseOptions,
          host: configService.getString('database.host'),
          port: configService.getNumber('database.port'),
          password: configService.getString('database.password'),
          user: configService.getString('database.username'),
          dbName: configService.getString('database.dbName'),
        }),
      inject: [ApiConfigService],
    }),
    MikroOrmModule.forFeature({
      entities: Object.values(Entities),
    }),
  ],
  exports: [MikroOrmModule],
})
export class OrmModule {}
