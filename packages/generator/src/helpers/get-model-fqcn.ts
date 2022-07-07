import {DMMF} from '@prisma/generator-helper';
import getModelClassName from './get-model-classname';

const getModelFqcn = (data: DMMF.Model) => {
  const namespace = 'App\\Models';
  const fqcn = `${namespace}\\${getModelClassName(data)}`;
  return {fqcn, namespace};
};

export default getModelFqcn;
