/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';

export function RoleRequired(role: string) {
  return function (target: any) {
    Reflect.defineMetadata('requiredRole', role, target);
  };
}
