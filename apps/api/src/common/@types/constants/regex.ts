export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*\W).*$/;

/**
 * Rules used:
 * This regex checks that password should contain at least one lowercase letter,
 * one uppercase letter, one numeric digit, and one special character.
 * Tests at https://regex101.com/r/m6CWm9/1
 */
export const USERNAME_REGEX = /^(?![\d._-])[\w-.]+$/;
