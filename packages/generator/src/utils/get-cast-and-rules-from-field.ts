import {ConnectorType, DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import getPrismaFqcn from '../helpers/get-prisma-fqcn';
import getDatabaseFieldAttribute from './raw-schema/get-database-field-attribute';
import isFieldUuid from '../helpers/is-field-uuid';
import isFieldEnum from '../helpers/is-field-enum';
import getTableNameFromModel from '../helpers/get-table-name-from-model';
import getEnumFqcn from '../helpers/get-enum-fqcn';

const getCastAndRulesFromField = (
  field: DMMF.Field,
  model: DMMF.Model,
  enums: DMMF.DatamodelEnum[],
  rawSchema: string,
  provider?: ConnectorType,
): {
  cast: {value: string | undefined; isMethodCall: boolean};
  rules: {value: string; isMethodCall: boolean}[];
  imports: Set<string>;
} => {
  const {name: fieldName, isUnique} = field;
  const {name: modelName, uniqueFields} = model;

  const cast: {value: string | undefined; isMethodCall: boolean} = {
    value: undefined,
    isMethodCall: false,
  };
  const rules: {value: string; isMethodCall: boolean}[] = [];
  const imports = new Set<string>();

  if (isUnique) {
    imports.add('Illuminate\\Validation\\Rule');
    rules.push({
      value: `Rule::unique('${getTableNameFromModel(
        model,
      )}', '${fieldName}')->ignore($this->getKey(), $this->getKeyName())`,
      isMethodCall: true,
    });
  }
  if (!_.isEmpty(uniqueFields)) {
    const uniqueFieldsToBeAdded = _.filter(
      uniqueFields,
      fields => !_.isEmpty(fields) && fields[0] === fieldName,
    );
    if (!_.isEmpty(uniqueFieldsToBeAdded)) {
      imports.add('Illuminate\\Validation\\Rule');
      for (const ufs of uniqueFieldsToBeAdded) {
        rules.push({
          value: `Rule::unique('${getTableNameFromModel(
            model,
          )}', '${fieldName}')->ignore($this->getKey(), $this->getKeyName())->where(fn ($query) => $query->${_.chain(
            ufs,
          )
            .slice(1)
            .map(f => `where('${f}', $this->${f})`)
            .join('->')
            .value()})`,
          isMethodCall: true,
        });
      }
    }
  }

  const {type, isList, isRequired} = field;

  if (isList) {
    cast.value = 'array';
    rules.push(
      {
        value: 'array',
        isMethodCall: false,
      },
      {
        value: 'required',
        isMethodCall: false,
      },
    );
  } else {
    if (isRequired) {
      rules.push({
        value: 'required',
        isMethodCall: false,
      });
    } else {
      rules.push({
        value: 'nullable',
        isMethodCall: false,
      });
    }

    switch (type) {
      case 'String':
        cast.value = 'string';
        rules.push({
          value: 'string',
          isMethodCall: false,
        });
        break;
      case 'Boolean':
        cast.value = 'boolean';
        rules.push({
          value: 'boolean',
          isMethodCall: false,
        });
        break;
      case 'Int':
      case 'BigInt':
      case 'Bytes':
        cast.value = 'integer';
        rules.push(
          {
            value: 'numeric',
            isMethodCall: false,
          },
          {
            value: 'integer',
            isMethodCall: false,
          },
        );
        break;
      case 'Float':
        cast.value = 'double';
        rules.push({
          value: 'numeric',
          isMethodCall: false,
        });
        break;
      case 'Decimal':
        cast.value = 'string';
        rules.push({
          value: 'numeric',
          isMethodCall: false,
        });
        break;
      case 'DateTime':
        cast.value = 'immutable_datetime';
        rules.push({
          value: 'date',
          isMethodCall: false,
        });
        break;
      case 'Json':
        cast.value = 'array';
        rules.push({
          value: 'json',
          isMethodCall: false,
        });
        break;
      default: {
        const enumInfo = isFieldEnum(field, enums);
        if (enumInfo) {
          const {fqcn} = getEnumFqcn(enumInfo);
          imports.add(fqcn);
          imports.add('Illuminate\\Validation\\Rules\\Enum');

          cast.isMethodCall = true;
          cast.value = `${enumInfo.name}::class`;

          rules.push({
            value: `new Enum(${enumInfo.name}::class)`,
            isMethodCall: true,
          });
        }
        break;
      }
    }
  }

  if (isFieldUuid(field)) {
    rules.push({
      value: `uuid`,
      isMethodCall: false,
    });
  }

  const databaseMapping = getDatabaseFieldAttribute(
    fieldName,
    modelName,
    rawSchema,
  );
  if (databaseMapping) {
    switch (provider) {
      case 'mysql':
        if (
          cast.value === 'integer' &&
          [
            'UnsignedInt',
            'UnsignedSmallInt',
            'UnsignedTinyInt',
            'UnsignedBigInt',
          ].includes(databaseMapping.replace(/\(.*\)/, ''))
        ) {
          rules.push({
            value: `min:0`,
            isMethodCall: false,
          });
        }
        break;
      default:
        break;
    }
  }

  return {cast, rules, imports};
};

export default getCastAndRulesFromField;
