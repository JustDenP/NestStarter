import { AbstractIdEntity } from '@common/database/abstract_entities/abstract-id.entity';
import { Entity } from '@mikro-orm/core';

@Entity({
  tableName: 'user_profile',
})
export class UserProfile extends AbstractIdEntity {
  constructor(partial?: Partial<UserProfile>) {
    super();
    Object.assign(this, partial);
  }
}
