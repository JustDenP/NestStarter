import { AbstractIdEntity } from '@common/database/abstract_entities/abstract-id.entity';
import { BooleanType, Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { User } from './user.entity';

@Entity()
export class Otp extends AbstractIdEntity {
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

  @Property({ type: BooleanType, default: false })
  isUsed = false;

  constructor(partial?: Partial<Otp>) {
    super();
    Object.assign(this, partial);
  }
}
