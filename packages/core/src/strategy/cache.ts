import { BaseCache } from '@loginjs/type';

export const createProxyCache = (
  Strategy: { strategyName: string },
  cache: BaseCache
) => {
  const getName = (key: string) => `${Strategy.strategyName}_${key}`;
  const proxyCache: BaseCache = {
    del: (key) => cache.del(getName(key)),
    get: (key) => cache.get(getName(key)),
    reset: async () => {
      //TODO consider many key return at once which will cause performance issue.
      const keys = await cache.store.keys();
      keys
        .filter((key) => key.startsWith(Strategy.strategyName))
        .forEach((key) => cache.del(key));
    },
    set: (key, ...args) => cache.set(getName(key), ...args),
    wrap: (key, ...args) => cache.wrap(getName(key), ...args),
    //TODO finish store proxy.
    store: cache.store,
  };
  return proxyCache;
};
