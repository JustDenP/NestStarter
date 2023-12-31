import { HelperService } from '@common/helpers/helpers';
import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

// Fields to redact from logs
const redactFields = ['req.headers.authorization', 'req.body.password', 'req.body.confirmPassword'];
const basePinoOptions = {
  translateTime: true,
  ignore: 'pid,hostname',
  singleLine: true,
  redact: ['*.password', '*.confirmPassword'],
};

@Module({
  imports: [
    LoggerModule.forRootAsync({
      useFactory: () => ({
        pinoHttp: {
          timestamp: () => `,"timestamp":"${new Date().toISOString()}"`,
          name: 'api',
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          customProps: (_request, _response) => ({
            context: 'HTTP',
          }),
          serializers: {
            req(request) {
              request.body = request.raw.body;

              return request;
            },
          },
          redact: {
            paths: redactFields,
            censor: '**GDPR COMPLIANT**',
          },
          transport: HelperService.isProd()
            ? {
                target: 'pino/file',
                level: 'error', // log only errors to file
                options: {
                  ...basePinoOptions,
                  destination: './logs/app.log',
                  mkdir: true,
                  sync: false,
                },
              }
            : {
                targets: [
                  {
                    target: 'pino-pretty',
                    level: 'info', // log only and above to console
                    options: {
                      ...basePinoOptions,
                      colorize: true,
                    },
                  },
                  {
                    target: 'pino/file',
                    level: 'error', // log only errors to file
                    options: {
                      ...basePinoOptions,
                      destination: './logs/app.log',
                      mkdir: true,
                      sync: false,
                    },
                  },
                ],
              },
        },
        exclude: [{ method: RequestMethod.ALL, path: 'doc' }],
      }),
    }),
  ],
  exports: [LoggerModule],
})
export class NestPinoModule {}
