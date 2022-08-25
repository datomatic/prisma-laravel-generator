import {ConnectorType, DMMF} from '@prisma/generator-helper';
import _, {isArray} from 'lodash';
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
import isFieldRelation from '../../helpers/is-field-relation';
import getRelationsFromModel from '../../utils/get-relations-from-model';
import isFieldTouching from '../../helpers/is-field-touching';
import isFieldEagerLoaded from '../../helpers/is-field-eager-loaded';
import isModelPivot from '../../helpers/is-model-pivot';
import getPhpArgumentsWithDefaults from '../../helpers/get-php-arguments-with-defaults';
import getUnsupportedFields from '../../utils/raw-schema/get-unsupported-fields';
import getModelClassName from '../../helpers/get-model-classname';
import getModelTraits from '../../helpers/get-model-traits';
import getModelExtend from '../../helpers/get-model-extend';
import getModelImplements from '../../helpers/get-model-implements';

const generatePrismaModel = (
  model: DMMF.Model,
  models: DMMF.Model[],
  enums: DMMF.DatamodelEnum[],
  rawSchema: string,
  provider?: ConnectorType,
  baseModel = 'Illuminate\\Database\\Eloquent\\Model',
  basePivotModel = 'Illuminate\\Database\\Eloquent\\Relations\\Pivot',
  prefix = 'Prisma',
  explicitTableNamesOnRelations = true,
) => {
  const {name: className, fields: allFields, primaryKey} = model;

  const fields = [
    ..._.filter(allFields, f => !isFieldRelation(f)),
    ...(getUnsupportedFields(className, rawSchema) as DMMF.Field[]),
  ];

  const tableName = getTableNameFromModel(model);

  const {namespace} = getPrismaFqcn(model, prefix);
  const imports = new Set<string>();
  imports.add('\\Illuminate\\Database\\Eloquent\\Builder');
  imports.add('\\Closure');

  const traits = new Set<string>();
  for (const t of getModelTraits(model)) {
    imports.add(t);
    traits.add(getClassFromFQCN(t));
  }

  if (primaryKey && primaryKey.fields.length > 1) {
    throw new CompositeKeyError();
  }
  const primaryKeyField = _.find(fields, f => f.isId);
  if (primaryKeyField) {
    const mappedField = getMapFieldAttribute(
      primaryKeyField.name,
      className,
      rawSchema,
    );
    if (mappedField) {
      primaryKeyField.name = mappedField;
    }
  }

  if (
    _.some(fields, field => {
      const mappedName = getMapFieldAttribute(field.name, className, rawSchema);
      return !field.isId && mappedName && mappedName !== field.name;
    })
  ) {
    throw new MappedFieldError();
  }

  const isPivot = isModelPivot(model);

  const extendsClass =
    getModelExtend(model) ?? (isPivot ? basePivotModel : baseModel);

  const implementClasses = new Set<string>();
  for (const implementClass of getModelImplements(model)) {
    imports.add(implementClass);
    implementClasses.add(getClassFromFQCN(implementClass));
  }

  const {
    imports: relationImports,
    hasOne,
    belongsTo,
    hasMany,
    belongsToMany,
  } = getRelationsFromModel(model, models, explicitTableNamesOnRelations);
  for (const relationImport of relationImports) {
    imports.add(relationImport);
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
  const touchingFields = _.filter(allFields, f => isFieldTouching(f));
  const eagerLoadedFields = _.filter(allFields, f => isFieldEagerLoaded(f));

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
  const defaultsWithMethodCall = _.some(
    _.values(defaults),
    d => d.isMethodCall,
  );

  let primaryKeyCast;
  if (primaryKeyField) {
    primaryKeyCast = getCastAndRulesFromField(
      primaryKeyField,
      model,
      enums,
      guardedFields,
      fillableFields,
      massAssignable,
      rawSchema,
      provider,
    ).cast;
  }

  const {casts, rules} = _.chain(fields)
    .reduce(
      (object, field) => {
        const result = _.clone(object);

        const {
          cast: fieldCast,
          rules: fieldRules,
          imports: fieldImports,
        } = getCastAndRulesFromField(
          field,
          model,
          enums,
          guardedFields,
          fillableFields,
          massAssignable,
          rawSchema,
          provider,
        );

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

  const castsWithMethodCall = _.some(_.values(casts), c => c.isMethodCall);
  const rulesWithMethodCall = _.some(_.values(rules), r =>
    _.some(r, r2 => r2.isMethodCall),
  );

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

  if (hasMany.length > 0 || belongsToMany.length > 0) {
    imports.add('\\Illuminate\\Database\\Eloquent\\Collection');
  }

  return prettify(`<?php
    namespace ${namespace};

    use ${extendsClass};

    ${_.chain([...imports])
      .map(importFcqn => `use ${importFcqn};`)
      .join('\n')
      .value()}

    /**
     * ${getModelClassName(model, prefix)} Model
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
           } $${fieldName}`,
       )
       .join('\n')
       .value()}
     *
     ${_.chain(hasOne)
       .map(
         relation =>
           `* @property-read null|${relation.className} $${relation.name}`,
       )
       .join('\n')
       .value()}
     ${_.chain(belongsTo)
       .map(
         relation =>
           `* @property-read ${relation.nullable ? 'null|' : ''}${
             relation.className
           } $${relation.name}`,
       )
       .join('\n')
       .value()}
     ${_.chain(hasMany)
       .map(
         relation =>
           `* @property-read Collection<${relation.className}> $${relation.name}`,
       )
       .join('\n')
       .value()}
     ${_.chain(belongsToMany)
       .map(
         relation =>
           `* @property-read Collection<${relation.className}> $${relation.name}`,
       )
       .join('\n')
       .value()}
     */
    abstract class ${getModelClassName(
      model,
      prefix,
    )} extends ${getClassFromFQCN(extendsClass)} ${
    implementClasses.size > 0
      ? `implements ${_.chain([...implementClasses])
          .map(implementClass => `${implementClass}`)
          .join(', ')
          .value()}`
      : ''
  } {

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
          isArray(primaryKeyField.default) ||
          primaryKeyField.default.name !== 'autoincrement'
            ? 'public $incrementing = false;'
            : isPivot
            ? 'public $incrementing = true;'
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
        defaultsWithMethodCall
          ? `protected $attributes;`
          : !_.isEmpty(defaults)
          ? `protected $attributes = [
              ${_.chain(defaults)
                .map(
                  (fieldDefault, fieldName) =>
                    `'${fieldName}' => ${
                      _.isString(fieldDefault.value)
                        ? `'${fieldDefault.value}'`
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
        !_.isEmpty(touchingFields)
          ? `protected $touches = [
              ${_.chain(touchingFields)
                .map(f => `'${f.name}'`)
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        !_.isEmpty(eagerLoadedFields)
          ? `protected $with = [
              ${_.chain(eagerLoadedFields)
                .map(f => `'${f.name}'`)
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        rulesWithMethodCall
          ? `protected array $rules;`
          : !_.isEmpty(rules)
          ? `protected array $rules = [
              ${_.chain(rules)
                .map(
                  (fieldRules, fieldName) =>
                    `'${fieldName}' => [${_.chain(fieldRules)
                      .map(rule => `'${rule.value}'`)
                      .join(',\n')
                      .value()}]`,
                )
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        castsWithMethodCall
          ? 'protected $casts;'
          : !_.isEmpty(casts)
          ? `protected $casts = [
              ${_.chain(casts)
                .map((cast, fieldName) => `'${fieldName}' => '${cast.value}'`)
                .join(',\n')
                .value()}
            ];`
          : ''
      }

      ${
        defaultsWithMethodCall || rulesWithMethodCall || castsWithMethodCall
          ? `public function __construct(array $attributes = [])
             {
                ${
                  defaultsWithMethodCall
                    ? `$this->attributes = [
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
                          .value()},
                          ...($this->attributes ?? [])
                      ];`
                    : ''
                }
                ${
                  rulesWithMethodCall
                    ? `$this->rules = [
                         ${_.chain(rules)
                           .map(
                             (fieldRules, fieldName) =>
                               `'${fieldName}' => [${_.chain(fieldRules)
                                 .map(rule =>
                                   rule.isMethodCall
                                     ? rule.value
                                     : `'${rule.value}'`,
                                 )
                                 .join(',\n')
                                 .value()}]`,
                           )
                           .join(',\n')
                           .value()},
                          ...($this->rules ?? [])
                      ];`
                    : ''
                }
                ${
                  castsWithMethodCall
                    ? `$this->casts = [
                        ${_.chain(casts)
                          .map(
                            (cast, fieldName) =>
                              `'${fieldName}' => ${
                                cast.isMethodCall
                                  ? cast.value
                                  : `'${cast.value}'`
                              }`,
                          )
                          .join(',\n')
                          .value()},
                          ...($this->casts ?? [])
                      ];`
                    : ''
                }
                parent::__construct($attributes);
             }`
          : ''
      }

      ${
        !_.isEmpty(hasOne)
          ? _.chain(hasOne)
              .map(
                relation =>
                  `public function ${relation.name}() {
                    return $this->hasOne(
                      ${getPhpArgumentsWithDefaults(
                        [
                          `${relation.className}::class`,
                          relation.foreignKey
                            ? `'${relation.foreignKey}'`
                            : undefined,
                          relation.localKey
                            ? `'${relation.localKey}'`
                            : undefined,
                        ],
                        'null',
                      )}
                    );
                  }`,
              )
              .join('\n')
              .value()
          : ''
      }

      ${
        !_.isEmpty(belongsTo)
          ? _.chain(belongsTo)
              .map(
                relation =>
                  `public function ${relation.name}() {
                    return $this->belongsTo(
                      ${getPhpArgumentsWithDefaults(
                        [
                          `${relation.className}::class`,
                          relation.foreignKey
                            ? `'${relation.foreignKey}'`
                            : undefined,
                          relation.ownerKey
                            ? `'${relation.ownerKey}'`
                            : undefined,
                        ],
                        'null',
                      )}
                    );
                  }`,
              )
              .join('\n')
              .value()
          : ''
      }

      ${
        !_.isEmpty(hasMany)
          ? _.chain(hasMany)
              .map(
                relation =>
                  `public function ${relation.name}() {
                    return $this->hasMany(
                      ${getPhpArgumentsWithDefaults(
                        [
                          `${relation.className}::class`,
                          relation.foreignKey
                            ? `'${relation.foreignKey}'`
                            : undefined,
                          relation.localKey
                            ? `'${relation.localKey}'`
                            : undefined,
                        ],
                        'null',
                      )}
                    );
                  }`,
              )
              .join('\n')
              .value()
          : ''
      }

      ${
        !_.isEmpty(belongsToMany)
          ? _.chain(belongsToMany)
              .map(
                relation =>
                  `public function ${relation.name}() {
                    return $this->belongsToMany(
                      ${getPhpArgumentsWithDefaults(
                        [
                          `${relation.className}::class`,
                          relation.pivotTable
                            ? `'${relation.pivotTable}'`
                            : undefined,
                          relation.foreignPivotKey
                            ? `'${relation.foreignPivotKey}'`
                            : undefined,
                          relation.relatedPivotKey
                            ? `'${relation.relatedPivotKey}'`
                            : undefined,
                          relation.parentKey
                            ? `'${relation.parentKey}'`
                            : undefined,
                          relation.relatedKey
                            ? `'${relation.relatedKey}'`
                            : undefined,
                        ],
                        'null',
                      )}
                    )${
                      relation.using ? `->using(${relation.using}::class)` : ''
                    };
                  }`,
              )
              .join('\n')
              .value()
          : ''
      }
    }
  `);
};

export default generatePrismaModel;
