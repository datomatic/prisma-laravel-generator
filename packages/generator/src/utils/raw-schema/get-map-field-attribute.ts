// Inspired by:
// https://github.com/iiian/prisma-generator-entityframework/blob/master/packages/generator/src/helpers/rawSchema/getMappedFieldName.ts

import getFieldAttribute from './get-field-attribute';

const getMapFieldAttribute = (
  fieldName: string,
  modelName: string,
  rawSchema: string,
) => {
  return getFieldAttribute<string>(
    /@map\("([^"]*)"\)/g,
    1,
    fieldName,
    modelName,
    rawSchema,
  );
};

export default getMapFieldAttribute;
