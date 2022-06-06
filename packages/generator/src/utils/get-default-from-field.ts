import {ConnectorType, DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import CuidNotSupportedError from '../errors/cuid-not-supported-error';
import isFieldEnum from '../helpers/is-field-enum';
import getPrismaFqcn from '../helpers/get-prisma-fqcn';

const getDefaultFromField = (
  field: DMMF.Field,
  enums: DMMF.DatamodelEnum[],
  provider?: ConnectorType,
): {
  defaultValue?: string | boolean | number;
  isMethodCall: boolean;
  imports: Set<string>;
} => {
  let defaultValue;
  let isMethodCall = false;
  const imports = new Set<string>();

  if (typeof field.default !== 'object') {
    const enumInfo = isFieldEnum(field, enums);
    if (
      field.default &&
      enumInfo &&
      _.some(enumInfo.values, v => v.name === field.default)
    ) {
      const {fqcn} = getPrismaFqcn(enumInfo);
      imports.add(fqcn);
      defaultValue = `${enumInfo.name}::${field.default.toString()}`;
      isMethodCall = true;
    } else {
      defaultValue = field.default;
    }
  } else {
    switch (field.default.name) {
      case 'uuid':
        imports.add('Illuminate\\Support\\Str');
        defaultValue = 'Str::orderedUuid()';
        isMethodCall = true;
        break;
      case 'cuid':
        throw new CuidNotSupportedError();
      case 'now':
        if (provider === 'mongodb') {
          imports.add(`Illuminate\\Support\\Carbon`);
          defaultValue = 'Carbon::now()';
          isMethodCall = true;
        } else {
          defaultValue = undefined;
        }
        break;
      default:
        defaultValue = undefined;
        break;
    }
  }
  return {defaultValue, isMethodCall, imports};
};

export default getDefaultFromField;
