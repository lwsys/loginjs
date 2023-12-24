export enum TypeEnum {
  unknown,
  string,
  int,
  boolean,
  object,
}
export interface IBaseStrategy {
  type: TypeEnum;
  children?: Record<string, IBaseStrategy>;
  defaultValue: unknown;
  isUnique: boolean;
}

abstract class BaseType<Type = unknown> implements IBaseStrategy {
  readonly type: TypeEnum = TypeEnum.unknown;
  defaultValue!: Type;
  isUnique = false;
  constructor(defaultValue: Type) {
    this.defaultValue = defaultValue;
  }

  default(v: Type) {
    this.defaultValue = v;
    return this;
  }
  setUnique(v: boolean) {
    this.isUnique = v;
    return this;
  }
}

class StringType extends BaseType<string> {
  type = TypeEnum.string;
  static create(d: string) {
    return new StringType(d);
  }
}

class IntType extends BaseType<number> {
  type = TypeEnum.int;
  static create(d: number) {
    return new IntType(d);
  }
}
class BooleanType extends BaseType<boolean> {
  type = TypeEnum.boolean;
  static create(d: boolean) {
    return new BooleanType(d);
  }
}
// reference from zod, why use generic can identify its types?
type identity<T> = T;
type flatten<T> = identity<{ [k in keyof T]: T[k] }>;

type GetObjectOutput<T> = {
  [key in keyof T]: T[key] extends ObjectType<T[key]>
    ? GetObjectOutput<T[key]>
    : TypeOf<T[key]>;
};

class ObjectType<T> extends BaseType<flatten<GetObjectOutput<T>>> {
  type = TypeEnum.object;
  constructor(public children: T) {
    //TODO: use a better default value
    super({} as any);
  }
  static create<T>(children: T) {
    return new ObjectType(children);
  }
}

const string = StringType.create;
const int = IntType.create;
const boolean = BooleanType.create;
const object = ObjectType.create;

import decamelize from 'decamelize';

export type TypeOf<T> = T extends BaseType ? T['defaultValue'] : never;
export { string, int, boolean, object };
export const getFieldName = (strategyName: string, field: string) =>
  decamelize(`${strategyName}_${field}`, {
    separator: '_',
  });
export const removeStrategyName = (strategyName: string, field: string) => {
  return field.replace(strategyName + '_', '');
};
export const isMatchStrategy = (strategyName: string, field: string) => {
  return field.startsWith(strategyName + '_');
};
