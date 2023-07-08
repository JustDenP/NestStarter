import cloneDeep from 'lodash/cloneDeep';
import has from 'lodash/has';
import isObject from 'lodash/isObject';
import omit from 'lodash/omit';
import unset from 'lodash/unset';

export const ObjectUtils = {
  /**
   * Excludes field from object
   *
   * @function
   *
   * @param {Obj} object
   * @param {keys}
   *
   * @returns {Obj} Returns data with removed properties.
   */
  xcludeObjectFields: <Obj, Key extends keyof Obj>(object: Obj, ...keys: Key[]): Omit<Obj, Key> => {
    for (const key of keys) {
      delete object[key];
    }

    return object;
  },
  /**
   * Unsets object properties.
   *
   * @function
   *
   * @param {T} data
   * @param {string[]|number[]} keys
   * @param {boolean} shouldClone
   *
   * @returns {T} Returns data with removed properties.
   */
  unsetObjectProperties: <T = any>(
    data: T,
    keys: string[] | number[] = [],
    shouldClone = true,
  ): Partial<T> => {
    if (!data || !keys.length || !isObject(data)) {
      return data;
    }

    const newData = shouldClone ? cloneDeep(data) : data;

    keys.forEach((key) => {
      if (has(newData, key)) {
        unset(newData, key);
      }
    });

    return omit(newData, keys);
  },
};
