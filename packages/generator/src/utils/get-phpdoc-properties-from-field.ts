import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import getPrismaFqcn from '../helpers/get-prisma-fqcn';
import isFieldEnum from '../helpers/is-field-enum';
import isFieldReadOnly from '../helpers/is-field-read-only';

// eslint-disable-next-line unicorn/prevent-abbreviations
const getPhpDocPropertiesFromField = (
  field: DMMF.Field,
  enums: DMMF.DatamodelEnum[],
  guardedFields: DMMF.Field[],
  fillableFields: DMMF.Field[],
  massAssignable: boolean,
  isPivot: boolean,
): {phpType: string | undefined; readOnly: boolean; imports: Set<string>} => {
  const imports = new Set<string>();
  let readOnly = false;

  if (
    isFieldReadOnly(field) ||
    (field.isId &&
      !isPivot &&
      !massAssignable &&
      ((_.isEmpty(guardedFields) && _.isEmpty(fillableFields)) ||
        (_.isEmpty(guardedFields) && !_.includes(fillableFields, field)) ||
        _.includes(guardedFields, field)))
  ) {
    readOnly = true;
  }

  const {type, isList, isRequired} = field;

  let phpType;
  switch (type) {
    case 'String':
    case 'Decimal':
      phpType = 'string';
      break;
    case 'Boolean':
      phpType = 'bool';
      break;
    case 'Int':
    case 'BigInt':
    case 'Bytes':
      phpType = 'int';
      break;
    case 'Float':
      phpType = 'double';
      break;
    case 'DateTime':
      imports.add('Illuminate\\Support\\Carbon');
      phpType = 'Carbon';
      break;
    case 'Json':
      phpType = 'array';
      break;
    default: {
      const enumInfo = isFieldEnum(field, enums);
      if (enumInfo) {
        const {fqcn} = getPrismaFqcn(enumInfo);
        imports.add(fqcn);

        phpType = enumInfo.name;
      }
      break;
    }
  }

  return {
    phpType: phpType
      ? `${isRequired ? '' : '?'}${phpType}${isList ? '[]' : ''}`
      : undefined,
    readOnly,
    imports,
  };
};

export default getPhpDocPropertiesFromField;
