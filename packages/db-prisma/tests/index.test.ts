import { MockContext, Context, createMockContext } from './context';
import { createUser } from '../src/index';

let mockCtx: MockContext;
let ctx: Context;

beforeEach(() => {
  mockCtx = createMockContext();
  ctx = mockCtx as unknown as Context;
});

test('should create new user ', async () => {
  const user = {
    id: 'hello',
    username: 'Rich',
    email: 'hello@prisma.io',
    acceptTermsAndConditions: true,
  };
  mockCtx.prisma.user.create.mockResolvedValue(user);

  await expect(createUser(user, ctx)).resolves.toEqual({
    id: 'hello',
    username: 'Rich',
    email: 'hello@prisma.io',
    acceptTermsAndConditions: true,
  });
});
