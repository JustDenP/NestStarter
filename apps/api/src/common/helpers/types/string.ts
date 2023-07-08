import { default as lodashIsNull } from 'lodash/isNull';
import isString from 'lodash/isString';
import map from 'lodash/map';
import snakeCase from 'lodash/snakeCase';

export const StringUtils = {
  /**
   * Uppercase the first character in a string.
   *
   * @function
   *
   * @param {string} input
   *
   * @returns {string}
   */
  ucFirst: (input: string): string => input.charAt(0).toUpperCase() + input.slice(1),

  /**
   * Uppercase the first character in words of a string.
   *
   * @function
   *
   * @param {string} input
   *
   * @returns {string}
   */
  getWords: (input: string): string[] => (isString(input) ? snakeCase(input).split('_') : []),

  /**
   * Uppercase the first character in words of a string.
   *
   * @function
   *
   * @param {string} input
   *
   * @returns {string}
   */
  ucWords: (input: string): string =>
    map(StringUtils.getWords(input), StringUtils.ucFirst).join(' '),

  /**
   * Converts string to sentence case.
   *
   * @function
   *
   * @param {string} input
   *
   * @returns {string}
   */
  sentenceCase: (input: string): string =>
    StringUtils.ucFirst(StringUtils.getWords(input).join(' ').toLowerCase()),

  /**
   * Converts string to lowercase.
   *
   * @function
   *
   * @param {string} input
   *
   * @returns {string}
   */
  toLowerCase: (input: string): string => (isString(input) ? input.toLowerCase() : input),

  /**
   * Joins strings with a symbol.
   *
   * @function
   *
   * @param {string} joinSymbol
   * @param {string[]} strings
   *
   * @returns {string}
   */
  join: (joinSymbol: string, ...strings: string[]): string => strings.join(joinSymbol),

  /**
   * Validates if a string value is null.
   *
   * @param {string} input
   *
   * @returns {boolean}
   */
  isNull: (input: string): boolean =>
    lodashIsNull(input) ? true : input === 'null' ? true : false,

  /**
   * Removing trailing spaces from a multi line string.
   *
   * @param {string} input
   *
   * @returns {string}
   */
  removeTrailingSpaces: (input: string): string =>
    input
      .split(/\r?\n/)
      .map((c) => (!c.length ? '\n' : c.trim()))
      .map((c) => (c.indexOf(':') > 1 ? `${c} ` : c))
      .join(''),
};
