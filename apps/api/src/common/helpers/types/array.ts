import { IMinMaxRangeInterval } from '@common/@types/interfaces/common.interface';

export const ArrayUtils = {
  /**
   * Runs async operations in a forEach loop
   * @param {T[]} arr
   * @param {Function} fn
   * @returns {any}
   */
  asyncForEach: async <T, K = any>(
    arr: T[],
    fn: (value: T, index: number, array: T[]) => K,
  ): Promise<K[]> => Promise.all(arr.map(fn)),

  /**
   * Creates a range interval with each object
   * containing min max according to step size.
   *
   * @param {number} minValue
   * @param {number} maxValue
   * @param {number} step
   * @returns {IMinMaxRangeInterval[]}
   */
  createMinMaxRangeInterval: (
    minValue: number,
    maxValue: number,
    step = 100,
  ): IMinMaxRangeInterval[] => {
    let count = 0;
    let currentValue = minValue;
    const minMaxRangeInterval: IMinMaxRangeInterval[] = [];

    while (currentValue < maxValue) {
      const min = count ? currentValue + 1 : currentValue;

      currentValue = maxValue - currentValue > step ? min + step - 1 : maxValue;

      minMaxRangeInterval.push({
        min,
        max: currentValue,
      });

      count++;
    }

    return minMaxRangeInterval;
  },
};
