import path from 'node:path';

import { Module } from '@nestjs/common';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      fallbacks: {
        'en-*': 'en',
        'np-*': 'np',
        en: 'en',
        np: 'np',
      },
      logging: false,
      loaderOptions: {
        path: path.join(__dirname, '../../resources/i18n/'),
        watch: true,
        includeSubfolders: true,
      },
      typesOutputPath: path.join('./src/generated/i18n.generated.ts'),
      resolvers: [
        new HeaderResolver(['x-custom-lang']),
        AcceptLanguageResolver,
        new CookieResolver(),
        { use: QueryResolver, options: ['lang', 'locale'] },
      ],
    }),
  ],
  exports: [I18nModule],
})
export class NestI18nModule {}
