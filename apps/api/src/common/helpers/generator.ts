import slugify from 'slugify';

export const GeneratorUtils = {
  generateVerificationCode: (): string => Math.floor(100000 + Math.random() * 900000).toString(),

  generatePassword: (): string => {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = lowercase.toUpperCase();
    const numbers = '0123456789';

    let text = '';

    for (let i = 0; i < 4; i++) {
      text += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
      text += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
      text += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }

    return text;
  },

  /**
   * generate random string
   * @param length
   */
  generateRandomString: (length: number): string => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789?=!@#$%&';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  },

  /**
   * Generating a slug from a string.
   * @param value - string
   */
  generateSlug: (value: string): string => slugify(value),
};
