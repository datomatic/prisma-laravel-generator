import {DMMF} from '@prisma/generator-helper';
import getModelClassName from './get-model-classname';

const getPrismaFqcn = (data: DMMF.Model, modelPrefix: string) => {
  const namespace = 'App\\Models\\Prisma';
  const fqcn = `${namespace}\\${getModelClassName(data, modelPrefix)}`;
  return {fqcn, namespace};
};

export default getPrismaFqcn;
