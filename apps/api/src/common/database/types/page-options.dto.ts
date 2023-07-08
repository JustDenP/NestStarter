import { QueryOrder } from '@common/@types/enums/order.enum';
import { ToBoolean } from '@common/decorators/transformers/transform.decorators';
import { MinMaxLength } from '@common/decorators/validators/min-max-length.decorator';
import { Dictionary } from '@mikro-orm/core/typings';
import { QueryBuilder } from '@mikro-orm/postgresql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
} from 'class-validator';

class DeepPageOptionsDTO {
  /**
   * From date filter
   */
  @IsOptional()
  @IsDateString()
  from?: string;

  /**
   * From date filter
   */
  @IsOptional()
  @IsDateString()
  to?: string;

  /**
   *  The search query
   */
  @IsOptional()
  @IsString()
  @MinMaxLength({ minLength: 1, maxLength: 100 })
  search?: string;

  /** The `withDeleted` property is a boolean flag that
   * indicates whether to include deleted items in the
   * results or not.
   */
  @IsOptional()
  @ToBoolean()
  @IsBoolean()
  withDeleted?: boolean = false;
}

export class PageOptionsDTO extends DeepPageOptionsDTO {
  /**
   * Results page you want to retrieve (0..N)
   */
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  page?: number = 1;

  /**
   * Number of results per page
   */
  @Type(() => Number)
  @IsInt()
  @Max(100)
  @IsOptional()
  readonly take?: number = 5;

  get skip(): number {
    return this.page <= 0 ? (this.page = 0) : (this.page - 1) * this.take;
  }

  /**
   * Sorting order
   */
  @IsEnum(QueryOrder)
  @IsOptional()
  readonly order?: QueryOrder = QueryOrder.ASC;

  /**
   * Sorting criteria
   */
  @IsString()
  @IsOptional()
  @MaxLength(50)
  readonly sort?: string = 'id';
}

export interface QBOPaginationOptions<T extends Dictionary> {
  pageOptionsDTO: PageOptionsDTO;
  qb: QueryBuilder<T>;
}
