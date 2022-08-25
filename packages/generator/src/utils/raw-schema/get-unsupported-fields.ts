import {DMMF} from '@prisma/generator-helper';
import getFieldLines from './get-field-lines';
import getDefaultFieldAttribute from './get-default-field-attribute';

const unsupportedMatcher = /^Unsupported\("(\\"|[^"])+"\)((\?)|(\[]))?$/g;
const uniqueMatcher = /@unique(\([^)]*\))?/g;
const idMatcher = /@id(\([^)]*\))?/g;
const updatedAtMatcher = /@updatedAt(\([^)]*\))?/g;
const defaultIsFunctionMatcher = /([^()]+)(\((("(\\"|[^"])+")|[^)])*\))/g;
const argumentsMatcher = /(("(\\"|[^"])*")|[^",]+)\s*(,\s*|$)/g;

const convertDefault = (
  defaultValue: string,
): string | number | boolean | DMMF.FieldDefault => {
  const sanitizedDefaultValue = defaultValue.trim();

  const defaultIsFunction = defaultIsFunctionMatcher.exec(
    sanitizedDefaultValue,
  );

  if (!defaultIsFunction) {
    return JSON.parse(sanitizedDefaultValue) as string | number | boolean;
  }

  const result: DMMF.FieldDefault = {
    name: defaultIsFunction[1],
    args: [],
  };
  argumentsMatcher.lastIndex = 0;
  let match = argumentsMatcher.exec(defaultIsFunction[3]);
  while (match) {
    result.args.push(convertDefault(match[1]));
    match = argumentsMatcher.exec(defaultIsFunction[3]);
  }
  return result;
};

const getUnsupportedFields = (
  modelName: string,
  rawContent: string,
): false | DMMF.Field[] => {
  const fieldLines = getFieldLines(modelName, rawContent);
  if (!fieldLines) {
    return false;
  }

  const fields: DMMF.Field[] = [];

  for (const fieldLine of fieldLines) {
    unsupportedMatcher.lastIndex = 0;
    const match = unsupportedMatcher.exec(fieldLine.type);
    if (match) {
      // const databaseName = getMapFieldAttribute(
      //   fieldLine.id,
      //   modelName,
      //   rawContent,
      // );
      const defaultValue = getDefaultFieldAttribute(
        fieldLine.id,
        modelName,
        rawContent,
      );

      const field: DMMF.Field = {
        kind: 'unsupported',
        name: fieldLine.id,
        isRequired: !match[3],
        isList: !!match[4],
        isUnique: !!fieldLine.attributes?.match(uniqueMatcher),
        isId: !!fieldLine.attributes?.match(idMatcher),
        isReadOnly: false,
        isGenerated: false,
        isUpdatedAt: !!fieldLine.attributes?.match(updatedAtMatcher),
        type: fieldLine.type.replace(/\[]$/, '').replace(/\?$/, ''),
        // dbNames: databaseName ? [databaseName] : undefined, // no field mapping allowed in laravel
        hasDefaultValue: !!defaultValue,
        default: defaultValue ? convertDefault(defaultValue) : undefined,
        // relationFromFields?: string[];
        // relationToFields?: any[];
        // relationOnDelete?: string;
        // relationName?: string;
        documentation: fieldLine.comment,
      };

      fields.push(field);
    }
  }

  return fields;
};

export default getUnsupportedFields;
