import {
  addDependenciesToPackageJson,
  addProjectConfiguration,
  formatFiles,
  generateFiles,
  names,
  readJson,
  Tree,
} from '@nx/devkit';
import * as path from 'path';
import { SeedGeneratorGeneratorSchema } from './schema';

export async function seedGeneratorGenerator(
  tree: Tree,
  options: SeedGeneratorGeneratorSchema
) {
  const fileName = names(options.name).fileName;
  const projectRoot = `packages/${fileName}`;
  const scopeName = readJson(tree, "package.json").name.split('/')[0]
  const packageName = `${scopeName}/${fileName}`
  addDependenciesToPackageJson(tree, {
    [packageName]: 'worksapces:*'
  },{})
  addProjectConfiguration(tree, options.name, {
    root: projectRoot,
    projectType: 'library',
    sourceRoot: `${projectRoot}/src`,
    targets: {},
  });
  generateFiles(tree, path.join(__dirname, 'files'), projectRoot, {...options,scope:scopeName});
  await formatFiles(tree);
}

export default seedGeneratorGenerator;
