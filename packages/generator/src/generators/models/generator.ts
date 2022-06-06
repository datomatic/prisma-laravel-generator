import {ConnectorType, DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import getClassFromFQCN from '../../utils/get-class-from-fqcn';
import CompositeKeyError from '../../errors/composite-key-error';
import getPrismaFqcn from '../../helpers/get-prisma-fqcn';
import getCastAndRulesFromField from '../../utils/get-cast-and-rules-from-field';
import InvalidLaravelTimestampsError from '../../errors/invalid-laravel-timestamps-error';
import isFieldCreatedTimestamp from '../../helpers/is-field-created-timestamp';
import isFieldUpdatedTimestamp from '../../helpers/is-field-updated-timestamp';
import isFieldGuarded from '../../helpers/is-field-guarded';
import isFieldFillable from '../../helpers/is-field-fillable';
import isFieldDeletedTimestamp from '../../helpers/is-field-deleted-timestamp';
import getDefaultFromField from '../../utils/get-default-from-field';
import getPhpTypeFromField from '../../utils/get-phpdoc-properties-from-field';
import getTableNameFromModel from '../../helpers/get-table-name-from-model';
import getMapFieldAttribute from '../../utils/raw-schema/get-map-field-attribute';
import MappedFieldError from '../../errors/mapped-field-error';
import {prettify} from '../../utils/prettier';
import isModelMassAssignable from '../../helpers/is-model-mass-assignable';
import MassAssignableConflictError from '../../errors/mass-assignable-conflict-error';
import FillableGuardedConflictError from '../../errors/fillable-guarded-conflict-error';
import isFieldHidden from '../../helpers/is-field-hidden';
import isFieldVisible from '../../helpers/is-field-visible';
import HiddenVisibleConflictError from '../../errors/hidden-visible-conflict-error';

const generateModel = (
  model: DMMF.Model,
  enums: DMMF.DatamodelEnum[],
  rawSchema: string,
  provider?: ConnectorType,
  baseModel = 'Illuminate\\Database\\Eloquent\\Model',
) => {
  const {name: className, fields, primaryKey} = model;

  const tableName = getTableNameFromModel(model);

  const {namespace} = getPrismaFqcn(model);
  const imports = new Set<string>();
  imports.add('\\Illuminate\\Database\\Eloquent\\Builder');
  imports.add('\\Closure');

  const traits = new Set<string>();

  if (primaryKey && primaryKey.fields.length > 1) {
    throw new CompositeKeyError();
  }
  const primaryKeyField = _.find(fields, f => f.isId);

  if (
    _.some(fields, field => {
      const mappedName = getMapFieldAttribute(field.name, className, rawSchema);
      return mappedName && mappedName !== field.name;
    })
  ) {
    throw new MappedFieldError();
  }

  let primaryKeyCast;
  if (primaryKeyField) {
    primaryKeyCast = getCastAndRulesFromField(
      primaryKeyField,
      model,
      enums,
      rawSchema,
      provider,
    ).cast;
  }

  const createdAtField = _.find(fields, f => isFieldCreatedTimestamp(f));
  const updatedAtField = _.find(fields, f => isFieldUpdatedTimestamp(f));
  if (
    (createdAtField && !updatedAtField) ||
    (!createdAtField && updatedAtField)
  ) {
    throw new InvalidLaravelTimestampsError();
  }
  const deletedAtField = _.find(fields, f => isFieldDeletedTimestamp(f));
  if (deletedAtField) {
    imports.add('Illuminate\\Database\\Eloquent\\SoftDeletes');
    traits.add('SoftDeletes');
  }

  const massAssignable = isModelMassAssignable(model);
  const fillableFields = _.filter(fields, f => isFieldFillable(f));
  const guardedFields = _.filter(fields, f => isFieldGuarded(f));
  if (
    massAssignable &&
    (!_.isEmpty(fillableFields) || !_.isEmpty(guardedFields))
  ) {
    throw new MassAssignableConflictError();
  }
  if (!_.isEmpty(fillableFields) && !_.isEmpty(guardedFields)) {
    throw new FillableGuardedConflictError();
  }

  const hiddenFields = _.filter(fields, f => isFieldHidden(f));
  const visibleFields = _.filter(fields, f => isFieldVisible(f));
  if (!_.isEmpty(hiddenFields) && !_.isEmpty(visibleFields)) {
    throw new HiddenVisibleConflictError();
  }

  const defaults = _.chain(fields)
    .reduce((object, field) => {
      const result = _.clone(object);
      const {
        defaultValue: fieldDefault,
        isMethodCall,
        imports: fieldImports,
      } = getDefaultFromField(field, enums, provider);

      result[field.name] = {value: fieldDefault, isMethodCall};
      for (const fieldImport of fieldImports) {
        imports.add(fieldImport);
      }

      return result;
    }, {} as {[fieldName: string]: {value: string | boolean | number | undefined; isMethodCall: boolean}})
    .omitBy(v => _.isNil(v.value))
    .value() as {
    [fieldName: string]: {
      value: string | boolean | number;
      isMethodCall: boolean;
    };
  };

  const {casts, rules} = _.chain(fields)
    .reduce(
      (object, field) => {
        const result = _.clone(object);

        const {
          cast: fieldCast,
          rules: fieldRules,
          imports: fieldImports,
        } = getCastAndRulesFromField(field, model, enums, rawSchema, provider);

        result.casts[field.name] = _.isNil(fieldCast.value)
          ? undefined
          : fieldCast;
        result.rules[field.name] = fieldRules;
        for (const fieldImport of fieldImports) {
          imports.add(fieldImport);
        }

        return result;
      },
      {casts: {}, rules: {}} as {
        casts: {
          [fieldName: string]:
            | {
                value: string | undefined;
                isMethodCall: boolean;
              }
            | undefined;
        };
        rules: {
          [fieldName: string]: {
            value: string;
            isMethodCall: boolean;
          }[];
        };
      },
    )
    .mapValues(castsOrRules => _.omitBy(castsOrRules, v => _.isNil(v)))
    .value() as {
    casts: {[fieldName: string]: {value: string; isMethodCall: boolean}};
    rules: {[fieldName: string]: {value: string; isMethodCall: boolean}[]};
  };

  // eslint-disable-next-line unicorn/prevent-abbreviations
  const propertiesPhpDocs = _.chain(fields)
    .reduce(
      (object, field) => {
        const result = _.clone(object);

        const {
          phpType,
          imports: fieldImports,
          readOnly,
        } = getPhpTypeFromField(
          field,
          enums,
          guardedFields,
          fillableFields,
          massAssignable,
        );

        result[field.name] = {value: phpType, readOnly};
        for (const fieldImport of fieldImports) {
          imports.add(fieldImport);
        }

        return result;
      },
      {} as {
        [fieldName: string]: {value: string | undefined; readOnly: boolean};
      },
    )
    .omitBy(v => _.isNil(v.value))
    .value() as {
    [fieldName: string]: {value: string; readOnly: boolean};
  };

  return prettify(`<?php
    namespace ${namespace};

    use ${baseModel};

    ${_.chain([...imports])
      .map(importFcqn => `use ${importFcqn};`)
      .join('\n')
      .value()}

    /**
     * ${className} Model
     *
     * @mixin Builder
     *
     * @method static Builder|static query()
     * @method static static make(array $attributes = [])
     * @method static static create(array $attributes = [])
     * @method static static forceCreate(array $attributes)
     * @method static firstOrNew(array $attributes = [], array $values = [])
     * @method static firstOrFail($columns = ['*'])
     * @method static firstOrCreate(array $attributes, array $values = [])
     * @method static firstOr($columns = ['*'], Closure $callback = null)
     * @method static firstWhere($column, $operator = null, $value = null, $boolean = 'and')
     * @method static updateOrCreate(array $attributes, array $values = [])
     * @method null|static first($columns = ['*'])
     * @method static static findOrFail($id, $columns = ['*'])
     * @method static static findOrNew($id, $columns = ['*'])
     * @method static null|static find($id, $columns = ['*'])
     *
     ${_.chain(propertiesPhpDocs)
       .map(
         (phpDocument, fieldName) =>
           `* @property${phpDocument.readOnly ? '-read' : ''} ${
             phpDocument.value
           }\t\t$${fieldName}`,
       )
       .join('\n')
       .value()}
     */
    abstract class ${className} extends ${getClassFromFQCN(baseModel)} {

      ${_.chain([...traits])
        .map(trait => `use ${trait};`)
        .join('\n')
        .value()}

      protected $table = '${tableName}';

      ${
        primaryKeyField
          ? `

        ${
          primaryKeyField.name !== 'id'
            ? `protected $primaryKey = '${primaryKeyField.name}';`
            : ''
        }

        ${
          !primaryKeyField.hasDefaultValue ||
          typeof primaryKeyField.default !== 'object' ||
          primaryKeyField.default.name !== 'autoincrement'
            ? 'public $incrementing = false;'
            : ''
        }

        ${
          primaryKeyCast &&
          primaryKeyCast.value &&
          primaryKeyCast.value !== 'integer'
            ? `protected $keyType = '${primaryKeyCast.value}';`
            : ''
        }
      `
          : ''
      }

      ${
        createdAtField && updatedAtField
          ? `${
              createdAtField.name !== 'created_at'
                ? `const CREATED_AT = '${createdAtField.name}';`
                : ''
            }
            ${
              updatedAtField.name !== 'updated_at'
                ? `const UPDATED_AT = '${updatedAtField.name}';`
                : ''
            }`
          : 'public $timestamps = false;'
      }

      ${
        deletedAtField && deletedAtField.name !== 'deleted_at'
          ? `const DELETED_AT = '${deletedAtField.name}';`
          : ''
      }

      ${
        !_.isEmpty(defaults)
          ? `protected $attributes = [
              ${_.chain(defaults)
                .map(
                  (fieldDefault, fieldName) =>
                    `'${fieldName}' => ${
                      _.isString(fieldDefault.value)
                        ? fieldDefault.isMethodCall
                          ? fieldDefault.value
                          : `'${fieldDefault.value}'`
                        : fieldDefault.value.toString()
                    }`,
                )
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        !_.isEmpty(fillableFields)
          ? `protected $fillable = [
              ${_.chain(fillableFields)
                .map(f => `'${f.name}'`)
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${massAssignable ? 'protected $guarded = [];' : ''}

      ${
        !_.isEmpty(guardedFields)
          ? `protected $guarded = [
              ${_.chain(guardedFields)
                .map(f => `'${f.name}'`)
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        !_.isEmpty(hiddenFields)
          ? `protected $hidden = [
              ${_.chain(hiddenFields)
                .map(f => `'${f.name}'`)
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        !_.isEmpty(visibleFields)
          ? `protected $visible = [
              ${_.chain(visibleFields)
                .map(f => `'${f.name}'`)
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        !_.isEmpty(rules)
          ? `protected $rules = [
              ${_.chain(rules)
                .map(
                  (fieldRules, fieldName) =>
                    `'${fieldName}' => [${_.chain(fieldRules)
                      .map(rule =>
                        rule.isMethodCall ? rule.value : `'${rule.value}'`,
                      )
                      .join(',\n')
                      .value()}]`,
                )
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        !_.isEmpty(casts)
          ? `protected $casts = [
              ${_.chain(casts)
                .map(
                  (cast, fieldName) =>
                    `'${fieldName}' => ${
                      cast.isMethodCall ? cast.value : `'${cast.value}'`
                    }`,
                )
                .join(',\n')
                .value()}
            ];`
          : ''
      }
    }
  `);
};

export default generateModel;
