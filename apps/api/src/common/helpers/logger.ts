export const LoggerUtils = {
  /**
   * Stringifies a JSON object for logging.
   *
   * @param {any} value
   * @param {boolean} prettify
   *
   * @returns {string}
   */
  logJSON: (value: any, prettify = true): string =>
    prettify ? JSON.stringify(value, null, 2) : JSON.stringify(value),

  /**
   * Returns the message with log lines.
   *
   * @param {string} message
   *
   * @returns {string}
   */
  logLine: (message: string): string => `------------------- ${message} -------------------`,
};
