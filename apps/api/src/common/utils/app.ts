import { Logger } from '@nestjs/common';
import process from 'process';

const logger = new Logger('App:Utils');

export const AppUtils = {
  /* The function is called when the process receives a signal. */
  gracefulShutdown(app, code: string): void {
    setTimeout(() => process.exit(1), 5000);
    logger.verbose(`Signal received with code ${code} ⚡.`);
    logger.log('❗Closing http server with grace.');
    app.close().then(() => {
      logger.log('✅ Http server closed.');
      process.exit(0);
    });
  },

  killAppWithGrace(app): void {
    process.on('SIGINT', async () => {
      AppUtils.gracefulShutdown(app, 'SIGINT');
    });

    process.on('SIGTERM', async () => {
      AppUtils.gracefulShutdown(app, 'SIGTERM');
    });
  },
};
