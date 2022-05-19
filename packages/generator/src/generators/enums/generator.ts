import {DMMF} from '@prisma/generator-helper';

const generateEnum = ({name: enumName, values}: DMMF.DatamodelEnum) => {
  const enumValues = values
    .map(({name: caseName, dbName}) => {
      if (dbName) {
        return `case ${caseName} = '${dbName}';`;
      }
      return `case ${caseName};`;
    })
    .join('\n');

  return `
    <?php
    namespace App\\Enums\\Prisma;

    enum ${enumName} {
      ${enumValues}
    }
  `;
};

export default generateEnum;
