import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiConfigService {
  constructor(private readonly config: ConfigService) {}

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
