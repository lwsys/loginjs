import { GeneratorFn } from './../../type/src/strategy-generator';
import cac from 'cac';
import inquirer from 'inquirer';
import { VERSION } from './constant';
import path from 'path';
import { getConfigFromFile } from './config';
import { model as PasswordStrategyModel } from '@loginjs/password-server';
import { IBaseStrategy } from '@loginjs/type';
const cli = cac('loginjs');

cli.command('init', 'init a loginjs project').action(() => {
  console.log('success');
});

cli.version(VERSION);
cli.help();
cli.parse();

async function start() {
  const cwd = process.cwd();
  const configPath = path.resolve(cwd, 'loginjs.config.ts');
  const config = await getConfigFromFile(configPath);
  await Promise.all(
    config.strategy.map(async (pkg) => {
      const generator = (
        await import(config.generator).catch(() => {
          throw new Error(`Can't find ${config.generator} generator`);
        })
      ).default.default;
      const { model, Strategy } = (
        await import(pkg).catch(() => {
          throw new Error(`Can't find ${pkg} model`);
        })
      ).default;
      generator({
        name: Strategy.strategyName,
        model: model,
      });
    })
  );
}
start();
