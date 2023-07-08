import * as fs from 'node:fs';

import { INestApplication, Logger } from '@nestjs/common';
import process from 'process';

export const AppUtils = {
  /* A function that is called when the process receives a signal. */
  async gracefulShutdown(app: INestApplication, code: string): Promise<void> {
    const logger: Logger = new Logger('Graceful Shutdown');

    setTimeout(() => process.exit(1), 5000);
    logger.verbose(`signal received with code ${code}`);
    logger.log('Closing http server...');
    await app.close().then(() => {
      logger.log('Http server closed.');
      process.exit(0);
    });
  },

  killAppWithGrace(app: INestApplication) {
    process.on('SIGINT', () => {
      void AppUtils.gracefulShutdown(app, 'SIGINT');
    });

    // kill -15

    process.on('SIGTERM', () => {
      void AppUtils.gracefulShutdown(app, 'SIGTERM');
    });
  },
};
