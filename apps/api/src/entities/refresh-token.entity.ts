import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import { BooleanType, Entity, ManyToOne, Property, Rel } from '@mikro-orm/core';

import { User } from './user.entity';

@Entity()
export class RefreshToken extends AbstractBaseEntity {
  @Property()
  expiresIn: Date;

  @ManyToOne({
    eager: false,
  })
  user: Rel<User>;

  /**
   *  To enable or disable the entity
   */
  @Property({ type: BooleanType, default: true })
  isActive = true;

  constructor(partial?: Partial<RefreshToken>) {
    super();
    Object.assign(this, partial);
  }
}
