import fs, { writeFile } from 'fs/promises';
import * as swc from '@swc/core';
import { pathToFileURL } from 'url';

type Config = {
  strategy: string[];
  orm: string;
  generator: string;
};
export const defineConfig = (config: Config) => config;

const getDefaultFromCjs = (config: any) => config.default ?? config;

export const getConfigFromFile = async (
  configPath: string
): Promise<Config> => {
  const config = await fs.readFile(configPath, 'utf-8').catch((rej) => {
    console.error("Can't find loginjs config");
    return;
  });
  if (!config) {
    process.exit(-1);
  }
  const res = await swc.transform(config, {
    module: {
      type: 'commonjs',
      strict: true,
    },
  });
  //todo accomplish esModule and Commonjs adapter
  const tempFileURL = pathToFileURL(`${configPath}-temp-${Date.now()}.js`);
  try {
    await fs.writeFile(tempFileURL, res.code);
    return getDefaultFromCjs(
      (await import(tempFileURL.href)).default
    ) as Config;
  } catch (e) {
    console.error(e);
    process.exit(-1);
  } finally {
    await fs.unlink(tempFileURL);
  }
};
