type StorageConfig<ORM extends any> = {
  orm: ORM;
  getUid: (user: any) => string | number;
};
type UserID = string | number;
export abstract class BaseStorage<ORM extends any> {
  orm: ORM;
  getUid: (user: User) => UserID;
  constructor(config: StorageConfig<ORM>) {
    this.orm = config.orm;
    this.getUid = config.getUid;
  }
  abstract createUser(user: User): Promise<void>;
  abstract findUserByUid(uid: UserID): Promise<User | null>;
  abstract setStrategyInfo(
    strategy: string,
    uid: UserID,
    record: Record<string, any>
  ): Promise<void>;

  abstract getStrategyInfo(
    strategy: string,
    uid: UserID
  ): Promise<Record<string, any> | null>;

  abstract updateStrategyInfo(
    strategy: string,
    uid: UserID,
    record: Record<string, any>
  ): Promise<void>;
}

export abstract class BaseStrategy {
  static strategyName: string;
  abstract dbInform: Record<keyof User, dbInform>;
  constructor(public db: BaseStorage<any>) {}

  abstract validate(
    userId: UserID,
    props: Record<string, unknown>
  ): Promise<boolean>;

  abstract created(user: User): Promise<void>;
  abstract updated(
    userId: UserID,
    props: Record<string, unknown>
  ): Promise<void>;
}
export enum DbType {
  String = 'string',
}

export interface dbInform {
  type: DbType;
  isPublic?: boolean;
  validator?: (data: string) => boolean;
}
export interface User {
  uid: any;
}
