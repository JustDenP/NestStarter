import path from 'node:path';

import { Logger } from '@nestjs/common';
import { availableParallelism, DynamicThreadPool, PoolEvents } from 'poolifier';

const logger = new Logger('Thread Pool');

export const pool = new DynamicThreadPool(
  2,
  availableParallelism(),
  path.resolve(__dirname, 'worker.js'),
  {
    enableTasksQueue: true,
    tasksQueueOptions: {
      concurrency: 8,
    },

    errorHandler: (error) => logger.error(error),
    onlineHandler: () => logger.log('✅ Worker is online'),
  },
);

pool.emitter.on(PoolEvents.full, () => console.info('Pool is full'));
pool.emitter.on(PoolEvents.busy, () => console.info('Pool is busy'));
