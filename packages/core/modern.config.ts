import { moduleTools, defineConfig } from '@modern-js/module-tools';
import { testingPlugin } from '@modern-js/plugin-testing';

export default defineConfig({
  plugins: [moduleTools(), testingPlugin()],
  buildPreset: 'npm-library',
  buildConfig: [
    {
      input: ['src/index.ts', 'src/cli.ts'],
      target: 'es2022',
      format: 'esm',
      buildType: 'bundle',
      outDir: 'dist/es',
      dts: false,
    },
    {
      input: ['src/index.ts', 'src/cli.ts'],
      format: 'cjs',
      buildType: 'bundle',
      outDir: 'dist/lib',
      dts: false,
    },
  ],
});
