import { Role } from '@common/@types/enums/roles.enum';
import { User } from '@entities';
import { Factory, Faker } from '@mikro-orm/seeder';

/* `UserFactory` is a factory that creates `User` instances */
export class UserFactory extends Factory<User> {
  model = User;

  definition(faker: Faker): Partial<User> {
    const random = faker.datatype.boolean();

    return {
      role: random ? Role.USER : Role.CLIENT,
      email: faker.internet.email(),
      password: random ? '123' : '',
      isVerified: faker.datatype.boolean(),
      isActive: faker.datatype.boolean(),
      firstName: faker.name.firstName(),
      lastName: faker.name.lastName(),
      phone: faker.phone.number('+48 91 ### ## ##'),
      picture: faker.image.avatar(),
    };
  }
}
