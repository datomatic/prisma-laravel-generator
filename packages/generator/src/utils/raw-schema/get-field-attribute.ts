import getFieldLine from './get-field-line';

const getFieldAttribute = <T extends string | string[]>(
  regex: RegExp,
  group: number,
  // allowMultiple: boolean,
  fieldName: string,
  modelName: string,
  rawSchema: string,
): false | T => {
  const line = getFieldLine(fieldName, modelName, rawSchema);
  if (!line) {
    return false;
  }
  const {attributes} = line;
  if (!attributes) {
    return false;
  }

  const result = [];
  let matches = regex.exec(attributes);
  while (matches) {
    result.push(matches[group]);
    matches = regex.exec(attributes);
  }

  // if (allowMultiple) {
  //   return result.length > 0 ? (result as T) : false;
  // }
  return result.length === 1 ? (result[0] as T) : false;
};

export default getFieldAttribute;
