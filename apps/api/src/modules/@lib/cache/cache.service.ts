import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { concatMap, from, map, Observable, toArray } from 'rxjs';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  /**
   * It deletes all cache keys that match the given regular expression
   * @param {string} regexString - The regex string to match against the cache keys.
   * @returns A boolean value.
   */
  deleteMatch(regexString: string): Observable<boolean> {
    return from(this.cacheManager.store.keys()).pipe(
      concatMap((keys: string[]) => {
        const regex = new RegExp(regexString, 'i');
        const match = keys.filter((key: string) => regex.test(key));

        return from(match);
      }),
      concatMap((key: string) => from(this.cacheManager.del(key))),
      toArray(),
      map(() => true),
    );
  }

  /**
   * Reset the cache.
   * @returns A promise that resolves to void.
   */
  async resetCache(): Promise<void> {
    return this.cacheManager.reset();
  }
}
