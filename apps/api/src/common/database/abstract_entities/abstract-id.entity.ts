import { Index, PrimaryKey } from '@mikro-orm/core';
import { ApiHideProperty } from '@nestjs/swagger';

export abstract class AbstractIdEntity {
  @ApiHideProperty()
  @PrimaryKey({ hidden: true })
  @Index()
  id!: number;
}
