import {DMMF} from '@prisma/generator-helper';

const getModelFqcn = (data: DMMF.Model) => {
  const namespace = 'App\\Models';
  const fqcn = `${namespace}\\${data.name}`;
  return {fqcn, namespace};
};

export default getModelFqcn;
