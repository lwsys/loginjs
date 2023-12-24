import { defineConfig } from '@loginjs/core';

export default defineConfig({
  strategy: ['@loginjs/password-server'],
  orm: '@loginjs/db-prisma',
  generator: '@loginjs/generator-prisma',
});
