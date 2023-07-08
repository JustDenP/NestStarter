import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiConfigService } from './config.service';
import { app } from './configs/app.config';
import { database } from './configs/database.config';
import { jwt } from './configs/jwt.config';
import { oauth } from './configs/oauth.config';
import { swagger } from './configs/swagger.config';
import { validationSchema } from './validation-schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/../../env/${process.env.NODE_ENV}.env`],
      load: [app, database, jwt, oauth, swagger],
      cache: process.env.NODE_ENV === 'development' ? false : true,
      expandVariables: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
