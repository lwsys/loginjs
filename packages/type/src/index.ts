export abstract class BaseStorage<T extends User = User> {
  constructor() {}
  abstract createUser(user: T): Promise<void>;
  abstract findUserByUid(uid: T["id"]): Promise<T>;
  abstract setStrategyInfo<Strategy = Record<string, any>>(
    strategy: string,
    uid: T["id"],
    record: Strategy
  ): Promise<void>;

  abstract getStrategyInfo<Strategy = Record<string, any>>(
    strategy: string,
    uid: T["id"]
  ): Promise<Strategy>;

  abstract updateStrategyInfo<Strategy = Record<string, any>>(
    strategy: string,
    uid: T["id"],
    record: Strategy
  ): Promise<void>;
}

export abstract class BaseStrategy<T = unknown> {
  abstract strategyName: string;
  abstract dbInform: Record<keyof T, dbInform>;
  constructor(public db: BaseStorage<T & User>) {}

  abstract validate(
    userId: User["id"],
    props: Record<string, unknown>
  ): Promise<boolean>;

  abstract created(user: T & User): Promise<void>;
  abstract updated(
    userId: User["id"],
    props: Record<string, unknown>
  ): Promise<void>;
}
export enum DbType {
  String = "string",
}

export interface dbInform {
  type: DbType;
  isPublic?: boolean;
  validator?: (data: string) => boolean;
}
export interface User {
  id: string | number;
  username: string;
}
