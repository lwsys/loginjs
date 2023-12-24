import fs from 'fs';
import path from 'path';
export const { version: VERSION } = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../../package.json'), {
    encoding: 'utf-8',
  })
);
