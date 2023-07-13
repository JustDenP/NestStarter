import { Index, PrimaryKey } from '@mikro-orm/core';

export abstract class AbstractIdEntity {
  @PrimaryKey()
  @Index()
  id!: number;
}
