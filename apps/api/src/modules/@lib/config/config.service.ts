import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { NodeEnv } from './node-env.enum';

@Injectable()
export class ApiConfigService {
  constructor(public readonly config: ConfigService) {}

  get isDevelopment(): boolean {
    return this.config.get<string>('app.env') === NodeEnv.Development;
  }

  get isProduction(): boolean {
    return this.config.get<string>('app.env') === NodeEnv.Production;
  }

  get isTest(): boolean {
    return this.config.get<string>('app.env') === NodeEnv.Test;
  }

  getNumber(key: string): number {
    const value = this.config.get<number>(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' config variable is not a number');
    }
  }

  getBoolean(key: string): boolean {
    const value = this.config.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' config variable is not a boolean');
    }
  }

  getString(key: string): string {
    const value = this.config.get(key);

    return String(value).replace(/\\n/g, '\n');
  }
}
