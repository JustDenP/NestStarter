import type { Options } from '@mikro-orm/core';
import { getOrmConfig } from '@modules/@lib/config/configs/database.config';

/**
 * `MikroOrmConfig`
 */
const config: Options = getOrmConfig(true);

export default config;
