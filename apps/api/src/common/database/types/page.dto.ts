import { Dictionary } from '@mikro-orm/core';
import { QueryBuilder } from '@mikro-orm/postgresql';
import { IsArray } from 'class-validator';

import { PageOptionsDTO } from './page-options.dto';

export class PageDTO<T> {
  @IsArray()
  readonly data: T[];
  readonly meta: PageMetaDTO;

  constructor(data: T[], meta: PageMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}

export interface QBOPaginationOptions<T extends Dictionary> {
  pageOptionsDTO: PageOptionsDTO;
  qb: QueryBuilder<T>;
}

export interface PageMetaDTOParameters {
  pageOptionsDTO: PageOptionsDTO;
  total: number;
}

export class PageMetaDTO {
  readonly total: number;
  readonly page: number;
  readonly take: number;
  readonly lastPage: number;
  readonly hasPreviousPage: boolean;
  readonly hasNextPage: boolean;

  constructor({ pageOptionsDTO, total }: PageMetaDTOParameters) {
    this.page = pageOptionsDTO.page <= 0 ? (this.page = 1) : pageOptionsDTO.page;
    this.take = pageOptionsDTO.take;
    this.total = total;
    this.lastPage = Math.ceil(this.total / this.take);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.lastPage;
  }
}
