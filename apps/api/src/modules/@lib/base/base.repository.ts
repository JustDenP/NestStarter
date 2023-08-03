import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import { PageDTO } from '@common/database/types/page.dto';
import { PageMetaDTO } from '@common/database/types/page-meta.dto';
import { QBOPaginationOptions } from '@common/database/types/page-options.dto';
import { User } from '@entities';
import { EntityName, FilterQuery } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';

export class BaseRepository<T extends AbstractBaseEntity> extends EntityRepository<T> {
  async _exists(where: FilterQuery<T>): Promise<boolean> {
    const count = await this.qb().where(where).getCount();

    return count > 0;
  }

  getEntityName(): EntityName<T> {
    return this.entityName;
  }

  softDelete(entity: T): T {
    entity.deletedAt = new Date();
    this.em.persist(entity);

    return entity;
  }

  deleteAndReturn(entity: T): T {
    this.em.remove(entity).flush();

    return entity;
  }

  restore(entity: T): T {
    entity.deletedAt = null;
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
