import { UserProfile } from '@entities';
import { Factory, Faker } from '@mikro-orm/seeder';

/* `UserFactory` is a factory that creates `User` instances */
export class UserProfileFactory extends Factory<UserProfile> {
  model = UserProfile;

  definition(faker: Faker): Partial<UserProfile> {
    return {};
  }
}
