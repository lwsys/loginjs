import {
  BaseStorage,
  User,
  getFieldName,
  isMatchStrategy,
  removeStrategyName,
} from '@loginjs/type';
import { PrismaClient } from '@prisma/client';

class PrismaStorage extends BaseStorage<PrismaClient> {
  async createUser(user: User): Promise<void> {
    await this.orm.loginStrategy.create({
      data: {
        ...user,
      },
    });
  }
  findUserByUid(uid: string) {
    return this.orm.loginStrategy.findFirst({
      where: {
        uid: uid,
      },
    });
  }
  async setStrategyInfo(
    strategy: string,
    uid: string,
    record: Record<string, any>
  ): Promise<void> {
    await this.orm.loginStrategy.update({
      where: {
        uid,
      },
      data: Object.fromEntries(
        Object.keys(record).map((field) => [
          getFieldName(strategy, field),
          record[field],
        ])
      ),
    });
  }
  async getStrategyInfo(strategy: string, uid: string) {
    const user = await this.orm.loginStrategy.findFirst({
      where: {
        uid: uid,
      },
    });
    if (!user) {
      return null;
    }
    const res: Record<string, any> = {};
    Object.keys(user ?? {}).forEach((field) => {
      if (isMatchStrategy(strategy, field)) {
        res[removeStrategyName(strategy, field)] = (
          user as Record<string, any>
        )[field];
      }
    });
    return res;
  }
  async updateStrategyInfo(
    strategy: string,
    uid: string,
    record: Record<string, any>
  ) {
    await this.orm.loginStrategy.update({
      where: {
        uid,
      },
      data: Object.fromEntries(
        Object.keys(record).map((field) => [
          getFieldName(strategy, field),
          record[field],
        ])
      ),
    });
  }
}

export default PrismaStorage;
