import type { Options } from '@mikro-orm/core';

import { getOrmConfig } from './modules/@lib/config/configs/database.config';

/**
 *
 * `MikroOrmConfig` is a configuration object for `MikroORM` that is used to
 * This is required to run mikro-orm cli
 *
 */
const config: Options = getOrmConfig(true);

export default config;
