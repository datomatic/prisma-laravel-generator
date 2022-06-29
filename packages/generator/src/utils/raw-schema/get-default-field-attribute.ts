import getFieldAttribute from './get-field-attribute';

const getDefaultFieldAttribute = (
  fieldName: string,
  modelName: string,
  rawSchema: string,
): false | string => {
  return getFieldAttribute<string>(
    /@default\((\d+|("(\\"|[^"])+")|(([^()]+)(\((("(\\"|[^"])+")|[^)])*\))?))\)/g,
    1,
    fieldName,
    modelName,
    rawSchema,
  );
};

export default getDefaultFieldAttribute;
