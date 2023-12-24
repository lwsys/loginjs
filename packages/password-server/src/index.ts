import { BaseStrategy, dbInform, DbType, User, s } from '@loginjs/type';
import model from './model';

class Strategy extends BaseStrategy {
  static strategyName: string = 'password';
  dbInform: Record<string, dbInform> = {
    password: {
      type: DbType.String,
    },
  };

  async validate(userId: User['uid'], props: { password: string }) {
    const res = await this.db.getStrategyInfo(Strategy.strategyName, userId);
    if (!res) {
      return false;
    }
    return res.password === props.password;
  }

  async created(user: User & s.TypeOf<typeof model>) {
    await this.db.setStrategyInfo(Strategy.strategyName, user.uid, {
      password: user.password,
    });
  }

  async updated(
    userId: User['uid'],
    props: {
      oldPassword: string;
      newPassword: string;
    }
  ) {
    if (!(await this.validate(userId, { password: props.oldPassword }))) {
      return;
    }

    await this.db.updateStrategyInfo(Strategy.strategyName, userId, {
      password: props.newPassword,
    });
  }
}
export { model, Strategy };
