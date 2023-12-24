import { UserManager } from '@loginjs/core';
import PrismaStorage from '@loginjs/db-prisma';
import { Strategy } from '@loginjs/password-server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const um = new UserManager(
  new PrismaStorage({
    orm: prisma as any,
    getUid: (user) => user.uid,
  })
);
um.use(Strategy);
import Koa from 'koa';
import Router from '@koa/router';
const koa = new Koa();
const router = new Router();

router.get('/', async (ctx) => {
  const res = await prisma.loginStrategy.findMany();
  ctx.body = JSON.stringify(res);
});
router.get('/login', async (ctx) => {
  if (
    await um.login('clqjoxwt00000cjknigr0srof', 'password', {
      password: 'hello',
    })
  ) {
    ctx.body = 'success';
  }
});
router.get('/create', async (ctx) => {
  const res = await prisma.user.create({
    data: {
      username: 'lwsy',
    },
  });
  await um.register(
    {
      uid: res.id,
    },
    'password',
    {
      password: 'hello',
    }
  );
  ctx.body = 'created';
});

koa.use(router.routes());
koa.listen(8000);
