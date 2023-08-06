import { Role } from '@common/@types/enums/roles.enum';
import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import { WithSoftDelete } from '@common/database/filters/with-soft-delete';
import { CryptUtils } from '@common/helpers/crypt';
import {
  BeforeCreate,
  BeforeUpdate,
  BeforeUpsert,
  BooleanType,
  Entity,
  Enum,
  EventArgs,
  Index,
  Property,
  Unique,
} from '@mikro-orm/core';

@Entity({ tableName: 'user' })
@WithSoftDelete()
export class User extends AbstractBaseEntity {
  constructor(data?: Partial<User>) {
    super();
    Object.assign(this, data);
  }

  @Enum({ items: () => Role, array: false, default: Role.USER })
  role: Role = Role.USER;

  @Unique()
  @Index()
  @Property()
  email: string;

  @Property({ hidden: true, lazy: true })
  password: string;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  @Unique()
  @Property()
  phone?: string;

  @Property()
  picture?: string;

  @Property({ type: BooleanType, default: false })
  isVerified = false;

  @Property({ type: BooleanType, default: true })
  isActive = true;

  @Property()
  lastLogin?: Date | null;

  /* Virtual field */
  @Property({ name: 'fullName' })
  getFullName() {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
  }

  /**
   * Lifecycle Hooks
   */
  @BeforeCreate()
  @BeforeUpdate()
  @BeforeUpsert()
  async hashPassword(arguments_: EventArgs<this>) {
    const payload = arguments_.changeSet?.payload;

    if (payload?.password || payload['password']?.length > 0) {
      this.password = CryptUtils.generateHash(this.password);
    }
  }
}
