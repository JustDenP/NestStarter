import { Filter } from '@mikro-orm/core';

interface IFilterArguments {
  getAll?: boolean;
  getOnlyDeleted?: boolean;
}

export const WithSoftDelete = (): ClassDecorator =>
  Filter({
    name: 'softDelete',
    cond: ({ getAll = true, getOnlyDeleted }: IFilterArguments = {}) => {
      if (getAll) {
        return {};
      }

      if (getOnlyDeleted) {
        return {
          deletedAt: {
            $ne: null,
          },
        };
      }

      return {
        deletedAt: null,
      };
    },
    default: true,
  });
