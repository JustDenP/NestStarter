import bcrypt from 'bcrypt';

export const CryptUtils = {
  /**
   * generate hash from password or string
   * @param {string}
   * @returns {string}
   */
  generateHash: (string: string): string => bcrypt.hashSync(string, 10),

  /**
   * validate text with hash
   * @param {string} plainString
   * @param {string} hash
   * @returns {Promise<boolean>}
   */
  validateHash: async (plainString: string, hash: string): Promise<boolean> => {
    if (!plainString || !hash) {
      return Promise.resolve(false);
    }

    return bcrypt.compare(plainString, hash);
  },
};
