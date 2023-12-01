import { BaseStorage } from '@loginjs/type';

export class MemoryStorage<User extends {}> extends BaseStorage<
  Record<string, any>,
  User
> {
  db: Record<
    string,
    User & {
      strategy: Record<string, any>;
    }
  > = {};
  async createUser(user: User): Promise<void> {
    this.db[this.getUid(user)] = { ...user, strategy: {} };
  }
  async findUserByUid(uid: string | number): Promise<User> {
    return this.db[uid];
  }
  async setStrategyInfo<Strategy = Record<string, any>>(
    strategy: string,
    uid: string | number,
    record: Strategy
  ): Promise<void> {
    this.db[uid].strategy[strategy] = record;
  }
  async getStrategyInfo<Strategy = Record<string, any>>(
    strategy: string,
    uid: string | number
  ): Promise<Strategy> {
    return this.db[uid].strategy[strategy];
  }
  async updateStrategyInfo<Strategy = Record<string, any>>(
    strategy: string,
    uid: string | number,
    record: Strategy
  ): Promise<void> {
    this.db[uid].strategy[strategy] = {
      ...this.db[uid].strategy[strategy],
      ...record,
    };
  }
}
