import { compare, hashSync } from 'bcrypt';

export const CryptUtils = {
  /**
   * generate hash from password or string
   * @param {string}
   * @returns {string}
   */
  generateHash: (string: string): string => hashSync(string, 8),

  /**
   * validate plain string with encrypted
   * @param {string} plain
   * @param {string} encrypted
   * @returns {Promise<boolean>}
   */
  validateHash: async (plain: string, encrypted: string): Promise<boolean> =>
    compare(plain, encrypted),
};
