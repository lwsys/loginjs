import { BaseStorage, BaseStrategy, User } from "@loginjs/type";

export class MemoryStorage extends BaseStorage {
  db: Record<
    User["id"],
    User & {
      strategy: Record<string, any>;
    }
  > = {};

  async createUser(user: User): Promise<void> {
    this.db[user.id] = { ...user, strategy: {} };
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
