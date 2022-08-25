import {ConnectorType, DMMF} from '@prisma/generator-helper';
import _, {isArray, isNil, isObject, isString} from 'lodash';
import CuidNotSupportedError from '../errors/cuid-not-supported-error';
import isFieldEnum from '../helpers/is-field-enum';
import getEnumFqcn from '../helpers/get-enum-fqcn';

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

  const fieldDefault = field.default;

  if (isNil(fieldDefault)) {
    defaultValue = undefined;
  } else if (!isObject(fieldDefault)) {
    const enumInfo = isFieldEnum(field, enums);
    if (enumInfo && _.some(enumInfo.values, v => v.name === fieldDefault)) {
      const {fqcn} = getEnumFqcn(enumInfo);
      imports.add(fqcn);
      defaultValue = `${enumInfo.name}::${fieldDefault.toString()}`;
      isMethodCall = true;
    } else {
      defaultValue = fieldDefault;
    }
  } else if (isArray(fieldDefault)) {
    const enumInfo = isFieldEnum(field, enums);
    if (
      enumInfo &&
      _.every(fieldDefault, v =>
        _.includes(
          _.map(enumInfo.values, enumValue => enumValue.name),
          v,
        ),
      )
    ) {
      const {fqcn} = getEnumFqcn(enumInfo);
      imports.add(fqcn);

      defaultValue = `[${_.chain(fieldDefault)
        .map(v => `${enumInfo.name}::${v.toString()}`)
        .join(', ')
        .value()}]`;
      isMethodCall = true;
    } else {
      defaultValue = `[${_.chain(fieldDefault)
        .map(v => (isString(v) ? `'${v}'` : v.toString()))
        .join(', ')
        .value()}]`;
      isMethodCall = true;
    }
  } else {
    switch (fieldDefault.name) {
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
