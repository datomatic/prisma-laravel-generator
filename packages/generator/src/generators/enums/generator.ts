import {DMMF} from '@prisma/generator-helper';
import {prettify} from '../../utils/prettier';
import getEnumFqcn from '../../helpers/get-enum-fqcn';

const generateEnum = (enumInfo: DMMF.DatamodelEnum) => {
  const {name: enumName, values} = enumInfo;

  const enumValues = values
    .map(({name: caseName, dbName}) => {
      if (dbName) {
        return `case ${caseName} = '${dbName}';`;
      }
      return `case ${caseName} = '${caseName}';`;
    })
    .join('\n');

  const {namespace} = getEnumFqcn(enumInfo);

  return prettify(`<?php
    namespace ${namespace};

    enum ${enumName}:string {
      ${enumValues}
    }
  `);
};

export default generateEnum;
