import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import {
  EntityData,
  FilterQuery,
  FindOneOptions,
  FindOptions,
  RequiredEntityData,
} from '@mikro-orm/core';
import { NotFoundException } from '@nestjs/common';

import { BaseRepository } from './base.repository';

export abstract class BaseService<
  T extends AbstractBaseEntity,
  CreateDto extends RequiredEntityData<T> = RequiredEntityData<T>,
  UpdateDto extends EntityData<T> = EntityData<T>,
> {
  protected constructor(private readonly repository: BaseRepository<T>) {}

  /**
   * Create entity
   */
  async create(data: CreateDto): Promise<T> {
    const entity = this.repository.create(data);
    await this.repository.getEntityManager().persistAndFlush(entity);

    return entity;
  }

  /**
   * Find all by specified options
   */
  async find<P extends string = never>(where: FilterQuery<T>, options?: FindOptions<T, P>) {
    const entities = await this.repository.find<P>(where, options);
    if (entities && entities.length) return entities.map((each) => each.toDTO());

    return [];
  }

  /**
   * Find one by specified options
   */
  async findOne<P extends string = never>(
    where: FilterQuery<T>,
    options?: FindOneOptions<T, P>,
  ): Promise<T> | null {
    const entity = await this.repository.findOne<P>(where, options);
    if (!entity) throw new NotFoundException();

    return entity;
  }

  /**
   * Find by ID
   */
  async findById(id: number, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findById(id, options);

    return entity;
  }

  /**
   * Update entity with provided data
   */
  async update(id: number, data: UpdateDto): Promise<T> {
    const entity = await this.repository.findById(id);
    const updatedEntity = this.repository.assign(entity, data);
    await this.repository.getEntityManager().flush();

    return updatedEntity;
  }

  /**
   * Soft delete entity
   */
  async softDelete(id: number): Promise<T> {
    const entity = await this.repository.findById(id);
    const deleted = this.repository.softDelete(entity);
    await this.repository.getEntityManager().flush();

    return deleted;
  }

  /**
   * Delete entity permanently
   */
  async permanentDelete(id: number): Promise<T> {
    const entity = await this.repository.findById(id);
    const deleted = this.repository.permanentDelete(entity);
    await this.repository.getEntityManager().flush();

    return deleted;
  }

  /**
   * Restore entity
   */
  async restore(id: number): Promise<T> {
    const entity = await this.repository.findById(id, {
      filters: {
        softDelete: {
          getOnlyDeleted: true,
        },
      },
    });
    const restored = this.repository.restore(entity);
    await this.repository.getEntityManager().flush();

    return restored;
  }
}
