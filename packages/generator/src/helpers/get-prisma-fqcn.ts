import {DMMF} from '@prisma/generator-helper';

type Enum = DMMF.DatamodelEnum;
type Model = DMMF.Model;

function isEnum(data: Enum | Model): data is Enum {
  return (data as Model).fields === undefined;
}

const getPrismaFqcn = (data: Enum | Model) => {
  const namespace = isEnum(data) ? 'App\\Enums\\Prisma' : 'App\\Models\\Prisma';
  const fqcn = `${namespace}\\${data.name}`;
  return {fqcn, namespace};
};

export default getPrismaFqcn;
