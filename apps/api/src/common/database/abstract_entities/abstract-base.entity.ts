import { HelperService } from '@common/helpers/helpers';
import { Property, wrap } from '@mikro-orm/core';

import { AbstractIdEntity } from './abstract-id.entity';

/**
 * Base entity class for mikroorm models, that all other entities of the same type should extend.
 */
export abstract class AbstractBaseEntity extends AbstractIdEntity {
  /**
   *  Marked true when entity is soft deleted
   */
  @Property({ hidden: true })
  isDeleted? = false;

  /**
   *  The date that the entity was soft-deleted. Nullable because it's not set until the entity is soft-deleted.
   */
  @Property()
  deletedAt?: Date | null;

  /**
   *  The date that the entity was created
   */
  @Property()
  createdAt? = HelperService.getTimeInUtc(new Date());

  /**
   *  The date that the entity was last updated
   */
  @Property({
    onUpdate: () => HelperService.getTimeInUtc(new Date()),
    hidden: true,
  })
  updatedAt? = HelperService.getTimeInUtc(new Date());

  /*
  Methods
  */
  toDTO() {
    const data = wrap(this).toObject();

    return data;
  }
}
