import { Roles } from '@common/@types/enums/roles.enum';
import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import { WithSoftDelete } from '@common/database/filters/with-soft-delete';
import { CryptUtils } from '@common/helpers/crypt';
import { HelperService } from '@common/helpers/helpers';
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
import _ from 'lodash';

@Entity({ tableName: 'user' })
@WithSoftDelete()
export class User extends AbstractBaseEntity {
  constructor(data?: Partial<User>) {
    super();
    Object.assign(this, data);
  }

  @Enum({ items: () => Roles, array: true, default: [Roles.CLIENT] })
  roles: Roles[] = [Roles.CLIENT];

  @Unique()
  @Index()
  @Property()
  username: string;

  @Unique()
  @Index()
  @Property()
  email: string;

  @Property({ hidden: true, lazy: true })
  password: string;

  @Property({ type: BooleanType, default: false })
  isVerified = false;

  @Property({ type: BooleanType, default: true })
  isActive = true;

  @Property()
  firstName: string;

  @Property()
  lastName: string;

  /* Virtual field */
  @Property({ name: 'fullName' })
  getFullName() {
    if (this.firstName && this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }
  }

  @Unique()
  @Property()
  phone?: string;

  @Property()
  picture?: string;

  @Property()
  lastLogin? = new Date();

  /**
   * Relationships
   */
  // @OneToOne({
  //   owner: true,
  //   cascade: [Cascade.PERSIST, Cascade.REMOVE],
  //   onDelete: 'cascade',
  //   onUpdateIntegrity: 'cascade',
  // })
  // profile: UserProfile;

  /**
   * Lifecycle Hooks
   */
  @BeforeCreate()
  @BeforeUpdate()
  @BeforeUpsert()
  async hashPassword(arguments_: EventArgs<this>) {
    if (!_.isEmpty(arguments_.changeSet?.payload?.password)) {
      this.password = CryptUtils.generateHash(this.password);
    }
  }
}
