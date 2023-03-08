import { type ValidationError } from 'class-validator';

export function camelToKebab (str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function extractErrorKeysFromErrors (errors: ValidationError[]): string[] {
  const errorKeys = [];

  for (const error of errors) {
    for (const constraint in error.constraints) {
      console.log(constraint);
      errorKeys.push(
        `${error.property}-${camelToKebab(constraint)}`
      );
    }
  }

  return errorKeys;
}
