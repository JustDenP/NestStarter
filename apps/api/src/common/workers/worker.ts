import { CryptUtils } from '@common/utils/helpers/crypt';
import { ThreadWorker } from 'poolifier';

import { WorkerActions } from './actions';

/**
 * Worker functions.
 * pool.execute({ action: 'sum' }, 'workerFunction')
 */
const workerFunction = (data: { action: WorkerActions; payload: any }): any => {
  const { action, payload } = data;

  switch (action) {
    case WorkerActions.HashString: {
      return CryptUtils.generateHash(data.payload);
    }

    default: {
      throw new Error('Invalid function name');
    }
  }
};

const threadWorker = new ThreadWorker(workerFunction, { async: true });
export default threadWorker;
