import getMapFieldAttribute from '../utils/raw-schema/get-map-field-attribute';

const getDatabaseNameFromField = (
  fieldName: string,
  model: string,
  rawSchema: string,
): string => {
  return getMapFieldAttribute(fieldName, model, rawSchema) || fieldName;
};

export default getDatabaseNameFromField;
