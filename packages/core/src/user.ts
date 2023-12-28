import { createCache, memoryStore } from 'cache-manager';
import { BaseStorage, BaseStrategy, User, BaseCache } from '@loginjs/type';
import { createProxyCache } from './strategy/cache';

type GetClass<T extends abstract new (...args: any[]) => InstanceType<T>> =
  new (...args: ConstructorParameters<T>) => InstanceType<T>;

export class UserManager<T extends User> {
  strategyMap: Record<string, BaseStrategy> = {};
  cache: BaseCache;

  constructor(
    private db: BaseStorage<unknown>,
    {
      cache,
    }: {
      cache?: BaseCache;
    } = {}
  ) {
    //TODO fill in a basic cache config.
    this.cache = cache ?? createCache(memoryStore());
    this.init();
  }

  use(Strategy: GetClass<typeof BaseStrategy>) {
    const item = new Strategy({
      db: this.db,
      cache: createProxyCache(Strategy as any, this.cache),
    });
    this.strategyMap[(Strategy as any).strategyName] = item;
  }

  init() {}

  getUid() {}

  async login(
    userId: T['uid'],
    strategy: string,
    info: Record<string, unknown>
  ) {
    const currentStrategy = this.strategyMap[strategy];
    const res = await currentStrategy.validate(userId, info);
    return res;
  }

  async register(user: T, strategy: string, info: Record<string, unknown>) {
    const currentStrategy = this.strategyMap[strategy];
    await this.db.createUser(user);
    await currentStrategy.created({ ...info, ...user });
  }
}
