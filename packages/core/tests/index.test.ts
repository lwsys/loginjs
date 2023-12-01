import { PasswordStrategy } from '@loginjs/password-server';
import { describe, expect, test } from '@jest/globals';
import { UserManager } from '../src';
import { MemoryStorage } from '@loginjs/db-memory';
const userManger = new UserManager(
  new MemoryStorage<{
    uid: string;
  }>({
    getUid: (user) => user.uid,
    orm: {},
  })
);
userManger.use(PasswordStrategy as any);
describe('默认值 cases', () => {
  test('Have returns', async () => {
    await userManger.register(
      {
        id: '1',
        username: 'abcd',
      },
      'password',
      {
        password: '123456',
      }
    );
    const res = await userManger.login('1', 'password', {
      password: '123456',
    });
    expect(res).toBeTruthy();
  });
});
