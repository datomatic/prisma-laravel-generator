import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import isFieldEnum from '../helpers/is-field-enum';
import isFieldReadOnly from '../helpers/is-field-read-only';
import getEnumFqcn from '../helpers/get-enum-fqcn';

// eslint-disable-next-line unicorn/prevent-abbreviations
const getPhpDocPropertiesFromField = (
  field: DMMF.Field,
  enums: DMMF.DatamodelEnum[],
  guardedFields: DMMF.Field[],
  fillableFields: DMMF.Field[],
  massAssignable: boolean,
): {phpType: string | undefined; readOnly: boolean; imports: Set<string>} => {
  const imports = new Set<string>();
  let readOnly = false;

  if (isFieldReadOnly(field, guardedFields, fillableFields, massAssignable)) {
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
      if (readOnly) {
        imports.add('Carbon\\CarbonImmutable');
        phpType = 'CarbonImmutable';
      } else {
        imports.add('Illuminate\\Support\\Carbon');
        phpType = 'Carbon';
      }
      break;
    case 'Json':
      phpType = 'array';
      break;
    default: {
      const enumInfo = isFieldEnum(field, enums);
      if (enumInfo) {
        const {fqcn} = getEnumFqcn(enumInfo);
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
