import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import { PageDTO } from '@common/database/types/page.dto';
import { PageMetaDTO } from '@common/database/types/page-meta.dto';
import { QBOPaginationOptions } from '@common/database/types/page-options.dto';
import { HelperService } from '@common/helpers/helpers';
import { User } from '@entities';
import { EntityName } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';

export class BaseRepository<T extends AbstractBaseEntity> extends EntityRepository<T> {
  getEntityName(): EntityName<T> {
    return this.entityName;
  }

  /**
   * Soft Delete the entity
   * @param {T} entity
   * @return EntityManager
   * @memberof BaseRepositroy
   */
  softDelete(entity: T): T {
    entity.deletedAt = new Date();
    entity.isDeleted = true;
    this.em.persist(entity);

    return entity;
  }

  /**
   * Returns the deleted entity rather than `this`.
   * @param {T} entity
   * @return entity
   * @memberof BaseRepositroy
   */
  deleteAndReturn(entity: T): T {
    this.em.remove(entity).flush();

    return entity;
  }

  /**
   * Soft restore the entity
   * @param {T} entity
   * @return entity
   * @memberof BaseRepositroy
   */
  restore(entity: T): T {
    entity.deletedAt = null;
    entity.isDeleted = false;
    this.em.persist(entity);

    return entity;
  }

  /**
   * Offset pagination
   * @memberof BaseRepositroy
   */
  async paginate(
    dto: QBOPaginationOptions<T>,
    options?: { fields?: string[]; relations?: string[] },
  ): Promise<PageDTO<T>> {
    try {
      const { qb, pageOptionsDTO } = dto;
      const { take, skip, order, sort, withDeleted, from, to } = pageOptionsDTO;

      qb.where({
        isDeleted: false,
      }).orWhere({
        isDeleted: withDeleted,
      });

      if (from) {
        qb.andWhere({
          createdAt: {
            $gte: from,
          },
        });
      }

      if (to) {
        qb.andWhere({
          createdAt: {
            $lte: to,
          },
        });
      }

      if (options?.relations) {
        for (const relation of options.relations) {
          qb.leftJoinAndSelect(
            `${this.getEntityName()}.${relation}`,
            `${this.getEntityName()}_${relation}`,
          );
        }
      }

      qb.select(options?.fields ? [...options.fields, 'id'] : '*').orderBy({
        [sort]: order.toLowerCase(),
      });
      qb.limit(take).offset(skip);

      const [results, total] = await qb.getResultAndCount();

      results.map((each) => {
        if (each instanceof User && each['password']) {
          delete each['password'];

          return each;
        }
      });

      const pageMetaDTO = new PageMetaDTO({ pageOptionsDTO, total });

      const lastPage = pageMetaDTO.lastPage;

      if (lastPage > pageMetaDTO.page) {
        return new PageDTO(results, pageMetaDTO);
      }

      throw new NotFoundException();
    } catch (error) {
      throw new NotFoundException();
    }
  }
}
