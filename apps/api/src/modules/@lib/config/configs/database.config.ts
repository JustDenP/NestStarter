import { HelperService } from '@common/helpers/helpers';
import type { Options } from '@mikro-orm/core';
import { LoadStrategy, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { logger } from '@mikro-orm/nestjs';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { Logger, NotFoundException } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

export const database = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  dbName: process.env.DB_DATABASE,
  dbUrl: process.env.DATABASE_URL,
}));

export const getOrmConfig = (isCLI: boolean): Options => {
  dotenv.config({
    path: `${process.cwd()}/../../.env`,
  });

  let loggerType;

  if (isCLI) {
    loggerType = new Logger('MikroORM - CLI');
  } else {
    loggerType = new Logger('MikroORM');
  }

  return {
    type: 'postgresql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    password: process.env.DB_PASSWORD,
    user: process.env.DB_USER,
    dbName: process.env.DB_DATABASE,
    entities: ['dist/entities/*.entity.js'],
    entitiesTs: ['src/entities/*.entity.ts'],
    loadStrategy: LoadStrategy.JOINED,
    highlighter: HelperService.isProd() ? new SqlHighlighter() : undefined,
    debug: true,
    logger: logger.log.bind(loggerType),
    metadataProvider: TsMorphMetadataProvider,
    namingStrategy: UnderscoreNamingStrategy,
    entityRepository: BaseRepository,
    forceUtcTimezone: true,
    allowGlobalContext: true,
    pool: { min: 2, max: 10 },
    findOneOrFailHandler: (entityName: string, key: any) =>
      new NotFoundException(`${entityName} not found for ${key}.`),
    seeder: {
      path: 'dist/common/database/seeders/',
      pathTs: 'src/common/database/seeders/',
      defaultSeeder: 'DatabaseSeeder',
      glob: '!(*.d).{js,ts}',
    },
    migrations: {
      tableName: 'migrations',
      path: 'dist/migrations',
      pathTs: './migrations',
      glob: '!(*.d).{js,ts}',
      transactional: true,
      disableForeignKeys: false, // wrap statements with `set foreign_key_checks = 0` or equivalent
      allOrNothing: true, // wrap all migrations in master transaction
      dropTables: true, // allow to disable table dropping
      safe: false, // allow to disable table and column dropping
      snapshot: true, // save snapshot when creating new migrations
      emit: 'ts',
    },
  };
};
