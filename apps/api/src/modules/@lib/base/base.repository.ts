import { AbstractBaseEntity } from '@common/database/abstract_entities/abstract-base.entity';
import { PageDTO, PageMetaDTO, QBOPaginationOptions } from '@common/database/types/page.dto';
import { getSkip } from '@common/database/types/page-options.dto';
import { HelperService } from '@common/utils/helpers/helpers';
import { StringUtils } from '@common/utils/helpers/types/string';
import { User } from '@entities';
import { EntityData, EntityName, FilterQuery, FindOneOptions } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotFoundException } from '@nestjs/common';

export class BaseRepository<T extends AbstractBaseEntity> extends EntityRepository<T> {
  /**
   * Utils
   */
  getEntityName(): EntityName<T> {
    return this.entityName;
  }

  async exists(where: FilterQuery<T>): Promise<boolean> {
    const count = await this.qb().where(where).getCount();

    return count > 0;
  }

  /**
   * Find by ID
   */
  async findById(id: number, options?: FindOneOptions<T>): Promise<T> {
    const entity = await this.findOne({ id } as any, options);

    return entity;
  }

  async update(entity: T, data: EntityData<T>): Promise<T> {
    const updatedEntity = this.assign(entity, data);
    this.em.persist(updatedEntity);

    return updatedEntity;
  }

  softDelete(entity: T): T {
    entity.deletedAt = new Date();
    this.em.persist(entity);

    return entity;
  }

  permanentDelete(entity: T): T {
    this.em.remove(entity);
    this.em.persist(entity);

    return entity;
  }

  restore(entity: T): T {
    entity.deletedAt = null;
    this.em.persist(entity);

    return entity;
  }

  /**
   * Offset pagination
   * @example http://localhost:3333/users/?page=1&take=30&order=ASC&sort=createdAt&from=2023-07-22&to=2023-07-26&deleted=false&where=id&is=1
   */
  async paginate(
    dto: QBOPaginationOptions<T>,
    options?: { fields?: string[]; relations?: string[] },
  ): Promise<PageDTO<T>> {
    try {
      const { qb, pageOptionsDTO } = dto;
      const { take, page, sort, order, where, is, from, to, deleted } = pageOptionsDTO;
      const skip = getSkip(page, take);

      qb.where({
        deletedAt: deleted
          ? {
              $ne: null,
            }
          : null,
      });

      if (where && is) {
        const isBoolOrNull = is === 'true' || is === 'false' || is === 'null';
        qb.andWhere({
          [where]: isBoolOrNull ? StringUtils.stringToBoolean(is) : StringUtils.stringOrNumber(is),
        });
      }

      if (from) {
        qb.andWhere({
          createdAt: {
            $gte: new Date(from),
          },
        });
      }

      if (to) {
        qb.andWhere({
          createdAt: {
            $lte: new Date(to),
          },
        });
      }

      // if (options?.relations) {
      //   for (const relation of options.relations) {
      //     qb.leftJoinAndSelect(
      //       `${this.getEntityName()}.${relation}`,
      //       `${this.getEntityName()}_${relation}`,
      //     );
      //   }
      // }

      qb.select(options?.fields ? [...options.fields, 'id'] : '*').orderBy({
        [sort]: order.toLowerCase(),
      });
      qb.limit(take).offset(skip);

      /* Prepare and return */
      const [results, total] = await qb.getResultAndCount();
      results.map((each) => {
        if (each instanceof User && each['password']) {
          delete each['password'];

          return each;
        }
      });

      const pageMetaDTO = new PageMetaDTO({ pageOptionsDTO, total });
      const lastPage = pageMetaDTO.lastPage;

      if (lastPage >= pageMetaDTO.page) {
        return new PageDTO(results, pageMetaDTO);
      }

      throw new NotFoundException();
    } catch (error) {
      if (HelperService.isDev()) throw error;

      throw new NotFoundException();
    }
  }
}
