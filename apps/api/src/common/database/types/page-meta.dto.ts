import { PageMetaDTOParameters } from './types';

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
