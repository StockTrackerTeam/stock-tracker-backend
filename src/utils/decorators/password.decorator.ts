import { registerDecorator, type ValidationArguments, type ValidationOptions } from 'class-validator';

export function ValidatePassword (validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'ValidatePassword',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: ['passwordTooWeak'],
      validator: {
        validate (value: any, args: ValidationArguments) {
          const regExp = /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
          return regExp.test(value);
        },
        defaultMessage (args: ValidationArguments) {
          return `${propertyName} must contain at least one uppercase, one lowercase and one number`;
        }
      }
    });
  };
}
