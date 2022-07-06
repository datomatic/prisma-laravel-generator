import {DMMF} from '@prisma/generator-helper';

const getPrismaFqcn = (data: DMMF.Model, modelPrefix = 'Prisma') => {
  const namespace = 'App\\Models\\Prisma';
  const fqcn = `${namespace}\\${modelPrefix}${data.name}`;
  return {fqcn, namespace};
};

export default getPrismaFqcn;
