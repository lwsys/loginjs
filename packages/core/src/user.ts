import {
  BaseStorage,
  BaseStrategy,
  DbType,
  User,
  dbInform,
} from '@loginjs/type';

type GetClass<T extends abstract new (...args: any[]) => InstanceType<T>> =
  new (...args: ConstructorParameters<T>) => InstanceType<T>;

export class UserManager<T extends User> {
  strategyMap: Record<string, BaseStrategy> = {};

  constructor(private db: BaseStorage<unknown>) {
    this.init();
  }

  use(Strategy: GetClass<typeof BaseStrategy>) {
    const item = new Strategy(this.db);
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

// interface Password {
//   password: string;
// }

// class PasswordStrategy extends BaseStrategy<Password> {
//   strategyName: string = "password";
//   dbInform: Record<keyof Password, dbInform> = {
//     password: {
//       type: DbType.String,
//     },
//   };

//   async validate(userId: User["id"], props: { password: string }) {
//     const res = await this.db.getStrategyInfo<Password>(
//       this.strategyName,
//       userId
//     );
//     return res.password === props.password;
//   }

//   async created(user: User & Password) {
//     await this.db.setStrategyInfo(this.strategyName, user.id, {
//       password: user.password,
//     });
//   }

//   async updated(
//     userId: User["id"],
//     props: {
//       oldPassword: string;
//       newPassword: string;
//     }
//   ) {
//     if (!(await this.validate(userId, { password: props.oldPassword }))) {
//       return;
//     }

//     await this.db.updateStrategyInfo(this.strategyName, userId, {
//       password: props.newPassword,
//     });
//   }
// }
