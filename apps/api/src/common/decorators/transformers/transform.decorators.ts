import { Transform } from 'class-transformer';

/**
 * It trims the value of a property and replaces multiple spaces with a single space
 * @returns A function that takes a parameter and returns a value.
 */
export const Trim = (): PropertyDecorator =>
  Transform((parameters) => {
    const value = parameters.value as string[] | string;

    if (Array.isArray(value)) {
      return value.map((v: string) => v.trim().replaceAll(/\s\s+/g, ' '));
    }

    return value.trim().replaceAll(/\s\s+/g, ' ');
  });

/**
 * It converts a string to a boolean
 * @returns A function that returns a PropertyDecorator
 */

export const ToBoolean = (): PropertyDecorator =>
  Transform(
    (parameters) => {
      switch (parameters.value) {
        case 'true': {
          return true;
        }

        case 'false': {
          return false;
        }

        default: {
          return parameters.value;
        }
      }
    },
    { toClassOnly: true },
  );
