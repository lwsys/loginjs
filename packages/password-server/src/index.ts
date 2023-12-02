import { BaseStrategy, dbInform, DbType, User, s } from '@loginjs/type';
import model from './model';

export class PasswordStrategy extends BaseStrategy<s.TypeOf<typeof model>> {
  strategyName: string = 'password';
  dbInform: Record<keyof s.TypeOf<typeof model>, dbInform> = {
    password: {
      type: DbType.String,
    },
  };

  async validate(userId: User['id'], props: { password: string }) {
    const res = await this.db.getStrategyInfo<s.TypeOf<typeof model>>(
      this.strategyName,
      userId
    );
    return res.password === props.password;
  }

  async created(user: User & s.TypeOf<typeof model>) {
    await this.db.setStrategyInfo(this.strategyName, user.id, {
      password: user.password,
    });
  }

  async updated(
    userId: User['id'],
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
