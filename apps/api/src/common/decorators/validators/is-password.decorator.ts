import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
class IsPasswordConstraint implements ValidatorConstraintInterface {
  validate(value: string, _arguments: ValidationArguments) {
    const passwordRegex = new RegExp(
      '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?\\d)(?=.*?[#?!@$%^&*-]).{8,}$',
    );

    return passwordRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    const property = args.property;

    return `${property} should contain at least one lowercase letter,
    one uppercase letter, one numeric digit, and one special character`;
  }
}

export const IsPassword = (validationOptions?: ValidationOptions) =>
  function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPasswordConstraint,
    });
  };
