import slugify from 'slugify';

export const GeneratorUtils = {
  resourceLink: (resource: string, id: string) => `${process.env['API_URL']}/${resource}/${id}`,

  generateVerificationCode: (): string => Math.floor(10000 + Math.random() * 90000).toString(),

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
  generateRandomString: (length: number): string =>
    Math.random()
      .toString(36)
      .replace(/[^\dA-Za-z]+/g, '')
      .slice(0, Math.max(0, length)),

  /**
   * Generating a slug from a string.
   * @param value - string
   */
  generateSlug: (value: string): string => slugify(value),
};
