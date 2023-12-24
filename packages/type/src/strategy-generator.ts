import { IBaseStrategy } from '../dist/types';

export type GeneratorFn = (config: {
  name: string;
  model: IBaseStrategy;
}) => Promise<void>;
