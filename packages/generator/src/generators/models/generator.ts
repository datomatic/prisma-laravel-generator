import {DMMF} from '@prisma/generator-helper';
import getClassFromFQCN from '../../utils/get-class-from-fqcn';
import getPrismaFqcn from '../../helpers/get-prisma-fqcn';
import {prettify} from '../../utils/prettier';
import getModelFqcn from '../../helpers/get-model-fqcn';

const generateModel = (model: DMMF.Model, prefix = 'Prisma') => {
  const {name: className} = model;

  const {namespace} = getModelFqcn(model);
  const {fqcn: prismaFqcn} = getPrismaFqcn(model, prefix);

  const imports = new Set<string>();
  imports.add(prismaFqcn);

  return prettify(`<?php
    namespace ${namespace};

    use ${prismaFqcn};

    /**
     * ${className} Model
     *
     * {@inheritdoc}
     */
    class ${className} extends ${getClassFromFQCN(prismaFqcn)} {

    }
  `);
};

export default generateModel;
