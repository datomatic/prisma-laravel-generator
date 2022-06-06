import {DMMF} from '@prisma/generator-helper';
import getPrismaFqcn from '../../helpers/get-prisma-fqcn';
import {prettify} from '../../utils/prettier';

const generateEnum = (enumInfo: DMMF.DatamodelEnum) => {
  const {name: enumName, values} = enumInfo;

  const enumValues = values
    .map(({name: caseName, dbName}) => {
      if (dbName) {
        return `case ${caseName} = '${dbName}';`;
      }
      return `case ${caseName};`;
    })
    .join('\n');

  const {namespace} = getPrismaFqcn(enumInfo);

  return prettify(`<?php
    namespace ${namespace};

    enum ${enumName} {
      ${enumValues}
    }
  `);
};

export default generateEnum;
