import { User, BaseStorage, BaseStrategy } from "@loginjs/type";
export class UserManager<T extends User> {
  strategyMap: Record<string, BaseStrategy> = {};

  constructor(private db: BaseStorage) {}

  init() {}

  getUid() {}

  async login(
    userId: T["id"],
    strategy: string,
    info: Record<string, unknown>
  ) {
    const currentStrategy = this.strategyMap[strategy];
    await currentStrategy.validate(userId, info);
  }

  async register(user: T, strategy: string) {
    const currentStrategy = this.strategyMap[strategy];
    await this.db.createUser(user);
    await currentStrategy.created(user);
  }
}
