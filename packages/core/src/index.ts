import {
  BaseStorage,
  BaseStrategy,
  DbType,
  User,
  dbInform,
} from "@loginjs/type";

class UserManager<T extends User> {
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

interface Password {
  password: string;
}

class PasswordStrategy extends BaseStrategy<Password> {
  strategyName: string = "password";
  dbInform: Record<keyof Password, dbInform> = {
    password: {
      type: DbType.String,
    },
  };

  async validate(userId: User["id"], props: { password: string }) {
    const res = await this.db.getStrategyInfo<Password>(
      this.strategyName,
      userId
    );
    return res.password === props.password;
  }

  async created(user: User & Password) {
    await this.db.setStrategyInfo(this.strategyName, user.id, {
      password: user.password,
    });
  }

  async updated(
    userId: User["id"],
    props: {
      oldPassword: string;
      newPassword: string;
    }
  ) {
    if (!(await this.validate(userId, { password: props.oldPassword }))) {
      return;
    }

    await this.db.updateStrategyInfo(this.strategyName, userId, {
      password: props.newPassword,
    });
  }
}
