enum TypeEnum {
  unknown,
  string,
  number,
  boolean,
  object,
}
abstract class BaseType<Type = unknown> {
  type: TypeEnum = TypeEnum.unknown;
  defaultValue!: Type;
  isOptional: boolean = false;
  optional() {
    this.isOptional = true;
    return this as BaseType<Type | undefined>;
  }
  default(v: Type) {
    this.defaultValue = v;
    return this;
  }
}

class StringType extends BaseType<string> {
  type = TypeEnum.string;
  static create() {
    return new StringType();
  }
}

class NumberType extends BaseType<number> {
  type = TypeEnum.number;
  static create() {
    return new NumberType();
  }
}
class BooleanType extends BaseType<boolean> {
  type = TypeEnum.boolean;
  static create() {
    return new BooleanType();
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
  constructor(public struct: T) {
    super();
  }
  static create<T>(struct: T) {
    return new ObjectType(struct);
  }
}

const string = StringType.create;
const number = NumberType.create;
const boolean = BooleanType.create;
const object = ObjectType.create;

export type TypeOf<T> = T extends BaseType ? T['defaultValue'] : never;

export { string, number, boolean, object };
