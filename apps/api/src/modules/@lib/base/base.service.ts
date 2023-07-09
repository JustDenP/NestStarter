import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import { FindOneOptions, FindOptions } from '@mikro-orm/core';
import { EntityData, FilterQuery } from '@mikro-orm/core/typings';
import { EntityManager } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';

import { BaseRepository } from './base.repository';

export abstract class BaseService<Entity extends AbstractBaseEntity> {
  protected constructor(
    private readonly repository: BaseRepository<Entity>,
    private readonly EM: EntityManager,
  ) {}

  /**
   * Find all by specified options
   * @param options
   * @returns Entity[] | EntityDTO<Entity>[]>
   */
  async _find<P extends string = never>(
    where: FilterQuery<Entity>,
    options?: FindOptions<Entity, P>,
  ) {
    const entities = await this.repository.find<P>(where, options);

    if (entities && entities.length) {
      return entities.map((each) => each.toDTO());
    }

    return [];
  }

  /**
   * Find one by specified options
   * @param where
   * @param options
   * @returns Entity
   */
  async _findOne<P extends string = never>(
    where: FilterQuery<Entity>,
    options?: FindOneOptions<Entity, P>,
  ): Promise<Entity> {
    const entity = await this.repository.findOne<P>(where, options);
    if (!entity) throw new NotFoundException();

    return entity;
  }

  /**
   * Update entity with provided data
   * @param id: number
   * @param data: Data to update
   * @returns Updated Entity
   */
  async _update(id, data: EntityData<Entity>): Promise<Entity> {
    const entity = await this._findOne(id);
    const updatedEntity = this.EM.assign(entity, data);
    this.EM.flush();

    return updatedEntity;
  }

  /**
   * Soft delete the entity
   * @param id: number
   * @returns Soft deleted entity
   */
  async _softDelete(id): Promise<void> {
    const entity = await this._findOne(id);
    this.repository.softDelete(entity);
    this.EM.flush();
  }

  /**
   * Delete the entity permanently
   * @param id: number
   * @returns Permanently deleted entity
   */
  async _delete(id): Promise<Entity> {
    const entity = await this._findOne(id, {
      populate: true,
    });
    const deleted = this.repository.deleteAndReturn(entity);

    return deleted;
  }

  /**
   * Restore the entity
   * @param id: number
   * @returns Restored entity
   */
  async _restore(id): Promise<Entity> {
    const entity = await this._findOne(id, {
      filters: {
        softDelete: {
          getOnlyDeleted: true,
        },
      },
    });
    const restored = this.repository.restore(entity);
    this.EM.flush();

    return restored;
  }
}
