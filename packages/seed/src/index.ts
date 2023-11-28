import { User, BaseStorage, BaseStrategy } from "@loginjs/type";

type GetClass<T extends abstract new (...args: any[]) => InstanceType<T>> =
  new (...args: ConstructorParameters<T>) => InstanceType<T>;

export class UserManager<T extends User> {
  strategyMap: Record<string, BaseStrategy> = {};

  constructor(private db: BaseStorage) {}

  use(Strategy: GetClass<typeof BaseStrategy>) {
    const item = new Strategy(this.db);
    this.strategyMap[item.strategyName] = item;
  }

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
