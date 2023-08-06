import { HelperService } from '@common/helpers/helpers';
import type { Options } from '@mikro-orm/core';
import { LoadStrategy, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { logger } from '@mikro-orm/nestjs';
import { defineConfig } from '@mikro-orm/postgresql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { SqlHighlighter } from '@mikro-orm/sql-highlighter';
import { BaseRepository } from '@modules/@lib/base/base.repository';
import { Logger, NotFoundException } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as dotenv from 'dotenv';

dotenv.config({
  path: `${process.cwd()}/../../.env`,
});

export const database = registerAs('database', () => ({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  password: process.env.DB_PASSWORD,
  username: process.env.DB_USERNAME,
  dbName: process.env.DB_DATABASE,
  dbUrl: process.env.DATABASE_URL,
}));

const loggerType = new Logger('MikroORM');

export const baseOptions = {
  entities: ['dist/entities/*.entity.js'],
  entitiesTs: ['src/entities/*.entity.ts'],
  findOneOrFailHandler: (entityName: string, key: any) =>
    new NotFoundException(`${entityName} not found for ${key}.`),
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
  seeder: {
    path: 'dist/common/database/seeders/',
    pathTs: 'src/common/database/seeders/',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
  },
  migrations: {
    migrations: {
      fileName: (timestamp: string, name?: string) => {
        if (!name) return `Migration${timestamp}`;

        return `Migration${timestamp}_${name}`;
      },
    },
    tableName: 'migrations', // name of database table with log of executed transactions
    path: './dist/migrations', // path to the folder with migrations
    pathTs: './migrations', // path to the folder with TS migrations
    glob: '!(*.d).{js,ts}', // how to match migration files (all .js and .ts files, but not .d.ts)
    transactional: true, // wrap each migration in a transaction
    allOrNothing: true, // wrap all migrations in master transaction
    snapshot: true, // save snapshot when creating new migrations
  },
};

const mikroConfig: Options = defineConfig({
  ...baseOptions,
  dbName: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
});

export default mikroConfig;
