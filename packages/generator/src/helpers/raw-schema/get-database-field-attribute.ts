import getFieldAttribute from './get-field-attribute';

const getDatabaseFieldAttribute = (
  fieldName: string,
  modelName: string,
  rawSchema: string,
): false | string => {
  return getFieldAttribute<string>(
    /@db\.((\w+)(\s*\(([^)]*)\))?)/g,
    1,
    false,
    fieldName,
    modelName,
    rawSchema,
  );
};

export default getDatabaseFieldAttribute;
