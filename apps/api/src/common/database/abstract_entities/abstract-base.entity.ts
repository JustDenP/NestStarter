import { Index, PrimaryKey, Property, wrap } from '@mikro-orm/core';

export abstract class AbstractBaseEntity {
  @PrimaryKey()
  @Index()
  id!: number;

  @Property()
  deletedAt?: Date | null;

  @Property()
  createdAt? = new Date();

  @Property({
    onUpdate: () => new Date(),
  })
  updatedAt? = new Date();

  toDTO() {
    const data = wrap(this).toObject();

    return data;
  }
}
