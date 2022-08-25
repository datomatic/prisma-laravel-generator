import {DMMF} from '@prisma/generator-helper';

const getEnumFqcn = (data: DMMF.DatamodelEnum) => {
  const namespace = 'App\\Enums\\Prisma';
  const fqcn = `${namespace}\\${data.name}`;
  return {fqcn, namespace};
};

export default getEnumFqcn;
