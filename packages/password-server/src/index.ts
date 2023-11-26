import { BaseStrategy, dbInform, DbType, User } from "@loginjs/type";
interface Props {
  password: string;
}

export class PasswordStrategy extends BaseStrategy<Props> {
  strategyName: string = "password";
  dbInform: Record<keyof Props, dbInform> = {
    password: {
      type: DbType.String,
    },
  };

  async validate(userId: User["id"], props: { password: string }) {
    const res = await this.db.getStrategyInfo<Props>(this.strategyName, userId);
    return res.password === props.password;
  }

  async created(user: User & Props) {
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
