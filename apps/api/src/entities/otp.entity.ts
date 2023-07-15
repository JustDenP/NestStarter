import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import { BooleanType, Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { User } from './user.entity';

@Entity()
export class Otp extends AbstractBaseEntity {
  @Property()
  expiresIn: Date;

  @Property({
    length: 20,
    index: true,
  })
  otpCode: string;

  @ManyToOne({
    eager: false,
    index: true,
  })
  user: Rel<User>;

  @Property({ type: BooleanType, default: true })
  isActive = true;

  constructor(partial?: Partial<Otp>) {
    super();
    Object.assign(this, partial);
  }
}
