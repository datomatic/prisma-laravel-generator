import {DMMF} from '@prisma/generator-helper';
import getClassFromFQCN from '../../utils/get-class-from-fqcn';
import getPrismaFqcn from '../../helpers/get-prisma-fqcn';
import {prettify} from '../../utils/prettier';
import getModelFqcn from '../../helpers/get-model-fqcn';
import getModelClassname from '../../helpers/get-model-classname';

const generateModel = (model: DMMF.Model, prefix = 'Prisma') => {
  const {namespace} = getModelFqcn(model);
  const {fqcn: prismaFqcn} = getPrismaFqcn(model, prefix);

  const imports = new Set<string>();
  imports.add(prismaFqcn);

  return prettify(`<?php
    namespace ${namespace};

    use ${prismaFqcn};

    /**
     * ${getModelClassname(model)} Model
     *
     * {@inheritdoc}
     */
    class ${getModelClassname(model)} extends ${getClassFromFQCN(prismaFqcn)} {

    }
  `);
};

export default generateModel;
