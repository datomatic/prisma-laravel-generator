import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import {prettify} from '../../utils/prettier';
import getEnumFqcn from '../../helpers/get-enum-fqcn';
import getModelTraits from '../../helpers/get-model-traits';
import getClassFromFQCN from '../../utils/get-class-from-fqcn';

const generateEnum = (enumInfo: DMMF.DatamodelEnum) => {
  const {name: enumName, values} = enumInfo;

  const imports = new Set<string>();

  const enumValues = values
    .map(({name: caseName, dbName}) => {
      if (dbName) {
        return `case ${caseName} = '${dbName}';`;
      }
      return `case ${caseName} = '${caseName}';`;
    })
    .join('\n');

  const {namespace} = getEnumFqcn(enumInfo);

  const traits = new Set<string>();
  for (const t of getModelTraits(enumInfo)) {
    imports.add(t);
    traits.add(getClassFromFQCN(t));
  }

  return prettify(`<?php
    namespace ${namespace};

    ${_.chain([...imports])
      .map(importFcqn => `use ${importFcqn};`)
      .join('\n')
      .value()}

    enum ${enumName}:string {
      ${_.chain([...traits])
        .map(trait => `use ${trait};`)
        .join('\n')
        .value()}

      ${enumValues}
    }
  `);
};

export default generateEnum;
