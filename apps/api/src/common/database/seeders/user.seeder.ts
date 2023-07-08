import { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

import { UserFactory } from '../factories/user.factory';

/**
 * Runs the UserSeeder, creating new users with associated posts, comments, and tags.
 *
 * @param em - The EntityManager instance to use for database operations.
 * @returns A Promise that resolves when the seeder has finished running.
 */

export class UserSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    new UserFactory(em)
      .each(async (user) => {
        // const profile = await new UserProfileFactory(em).create(_.random(2, 4), {});
        // profile.map((profile) => {
        //   user.profile = profile;
        // });
      })
      .make(30);
  }
}
