import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import isFieldRelation from '../helpers/is-field-relation';
import snake from './strings/snake';
import CompositeKeyOnRelationError from '../errors/composite-key-on-relation-error';
import isModelPivot from '../helpers/is-model-pivot';
import getTableNameFromModel from '../helpers/get-table-name-from-model';
import getModelByName from '../helpers/get-model-by-name';
import getRelatedFieldOfRelatedModel from '../helpers/get-related-field-of-related-model';
import getModelFqcn from '../helpers/get-model-fqcn';

// See: https://github.com/laravel/framework/blob/9.x/src/Illuminate/Database/Eloquent/Concerns/HasRelationships.php
type HasOneRelation = {
  name: string;
  className: string;
  foreignKey?: string; // ignore if == <Str::snake(this->className)>_<this->keyName>
  localKey?: string; // ignore if == this->keyName
};

type BelongsToRelation = {
  name: string;
  className: string;
  foreignKey?: string; // ignore if == <Str::snake(relationshipName)>_<this->keyName>
  ownerKey?: string; // ignore if == related->keyName
  nullable?: boolean;
};

type HasManyRelation = {
  name: string;
  className: string;
  foreignKey?: string; // ignore if == <Str::snake(this->className)>_<this->keyName>
  localKey?: string; // ignore if == this->keyName
};

type BelongsToManyRelation = {
  name: string;
  className: string;
  pivotTable?: string; // ignore if == <Str::snake(this->className)>_<Str::snake(related->className)> (in alphabetical order)
  foreignPivotKey?: string; // ignore if == <Str::snake(this->className)>_<this->keyName>
  relatedPivotKey?: string; // ignore if == <Str::snake(related->className)>_<related->keyName>
  parentKey?: string; // ignore if == this->keyName
  relatedKey?: string; // ignore if == related->keyName
  using?: string; // ignore if implicit
};

const emptyOrUndefined = <T>(value: undefined | T[]): value is undefined =>
  !value || value.length === 0;

const definedAndNotEmpty = <T>(value: undefined | T[]): value is T[] =>
  !!value && value.length > 0;

export const getHasOneRelation = (
  model: DMMF.Model,
  relationField: DMMF.Field,
  relatedModel: DMMF.Model,
  relatedField: DMMF.Field,
  explicitTableNames = true,
): false | [HasOneRelation, Set<string>] => {
  if (isModelPivot(model)) {
    return false;
  }

  if (relationField.isList || relatedField.isList) {
    return false;
  }

  if (
    definedAndNotEmpty(relationField.relationFromFields) ||
    definedAndNotEmpty(relationField.relationToFields) ||
    emptyOrUndefined(relatedField.relationFromFields) ||
    emptyOrUndefined(relatedField.relationToFields)
  ) {
    return false;
  }

  if (
    relatedField.relationFromFields.length > 1 ||
    relatedField.relationToFields.length > 1
  ) {
    throw new CompositeKeyOnRelationError();
  }

  const imports = new Set<string>();

  const primaryKeyField = _.find(model.fields, f => f.isId);

  imports.add(getModelFqcn(relatedModel).fqcn);
  let relation: HasOneRelation = {
    name: relationField.name,
    className: relatedModel.name,
  };

  if (
    explicitTableNames ||
    relatedField.relationFromFields[0] !==
      `${snake(model.name)}_${relatedField.relationToFields[0] as string}`
  ) {
    relation = {
      ...relation,
      foreignKey: relatedField.relationFromFields[0],
    };
  }

  if (
    explicitTableNames ||
    relatedField.relationToFields[0] !== (primaryKeyField?.name ?? 'id')
  ) {
    relation = {
      ...relation,
      localKey: relatedField.relationToFields[0] as string,
    };
  }

  return [relation, imports];
};

export const getBelongsToRelation = (
  model: DMMF.Model,
  relationField: DMMF.Field,
  relatedModel: DMMF.Model,
  relatedField: DMMF.Field,
  explicitTableNames = true,
): false | [BelongsToRelation, Set<string>] => {
  if (isModelPivot(model)) {
    return false;
  }

  if (relationField.isList) {
    return false;
  }

  /* istanbul ignore next */
  if (
    emptyOrUndefined(relationField.relationFromFields) ||
    emptyOrUndefined(relationField.relationToFields) ||
    definedAndNotEmpty(relatedField.relationFromFields) ||
    definedAndNotEmpty(relatedField.relationToFields)
  ) {
    return false;
    // ignored on jest coverage because if prisma validates
    // the schema this condition is always false
  }

  if (
    relationField.relationFromFields.length > 1 ||
    relationField.relationToFields.length > 1
  ) {
    throw new CompositeKeyOnRelationError();
  }

  const imports = new Set<string>();

  const relatedPrimaryKeyField = _.find(relatedModel.fields, f => f.isId);

  imports.add(getModelFqcn(relatedModel).fqcn);
  let relation: BelongsToRelation = {
    name: relationField.name,
    className: relatedModel.name,
    nullable: !relationField.isRequired,
  };

  if (
    explicitTableNames ||
    relationField.relationFromFields[0] !==
      `${snake(relationField.name)}_${
        relationField.relationToFields[0] as string
      }`
  ) {
    relation = {
      ...relation,
      foreignKey: relationField.relationFromFields[0],
    };
  }

  if (
    explicitTableNames ||
    relationField.relationToFields[0] !== (relatedPrimaryKeyField?.name ?? 'id')
  ) {
    relation = {
      ...relation,
      ownerKey: relationField.relationToFields[0] as string,
    };
  }

  return [relation, imports];
};

export const getHasManyRelation = (
  model: DMMF.Model,
  relationField: DMMF.Field,
  relatedModel: DMMF.Model,
  relatedField: DMMF.Field,
  explicitTableNames = true,
): false | [HasManyRelation, Set<string>] => {
  if (isModelPivot(model)) {
    return false;
  }

  if (!relationField.isList || relatedField.isList) {
    return false;
  }

  /* istanbul ignore next */
  if (
    definedAndNotEmpty(relationField.relationFromFields) ||
    definedAndNotEmpty(relationField.relationToFields) ||
    emptyOrUndefined(relatedField.relationFromFields) ||
    emptyOrUndefined(relatedField.relationToFields)
  ) {
    return false;
    // ignored on jest coverage because if prisma validates
    // the schema this condition is always false
  }

  if (
    relatedField.relationFromFields.length > 1 ||
    relatedField.relationToFields.length > 1
  ) {
    throw new CompositeKeyOnRelationError();
  }

  const imports = new Set<string>();

  const primaryKeyField = _.find(model.fields, f => f.isId);

  imports.add(getModelFqcn(relatedModel).fqcn);
  let relation: HasManyRelation = {
    name: relationField.name,
    className: relatedModel.name,
  };

  if (
    explicitTableNames ||
    relatedField.relationFromFields[0] !==
      `${snake(model.name)}_${relatedField.relationToFields[0] as string}`
  ) {
    relation = {
      ...relation,
      foreignKey: relatedField.relationFromFields[0],
    };
  }

  if (
    explicitTableNames ||
    relatedField.relationToFields[0] !== (primaryKeyField?.name ?? 'id')
  ) {
    relation = {
      ...relation,
      localKey: relatedField.relationToFields[0] as string,
    };
  }

  return [relation, imports];
};

export const getBelongsToManyRelation = (
  model: DMMF.Model,
  relationField: DMMF.Field,
  relatedModel: DMMF.Model,
  relatedField: DMMF.Field,
  models: DMMF.Model[],
  explicitTableNames = true,
): false | [BelongsToManyRelation[], Set<string>] => {
  const relations = [];
  if (isModelPivot(model)) {
    return false;
  }

  if (!relationField.isList) {
    return false;
  }

  const isImplicit = relatedField.isList;

  if (!isImplicit && !isModelPivot(relatedModel)) {
    return false;
  }

  const imports = new Set<string>();

  const primaryKeyField = _.find(model.fields, f => f.isId);
  // const relatedPrimaryKeyField = _.find(relatedModel.fields, f => f.isId);

  if (isImplicit) {
    /* istanbul ignore next */
    if (
      definedAndNotEmpty(relationField.relationFromFields) ||
      definedAndNotEmpty(relatedField.relationFromFields)
    ) {
      return false;
      // ignored on jest coverage because if prisma validates
      // the schema this condition is always false
    }

    imports.add(getModelFqcn(relatedModel).fqcn);

    const relation: BelongsToManyRelation = {
      name: relationField.name,
      className: relatedModel.name,
      foreignPivotKey:
        model.name.localeCompare(relatedModel.name) < 0 ? 'A' : 'B',
      relatedPivotKey:
        model.name.localeCompare(relatedModel.name) > 0 ? 'A' : 'B',
      pivotTable: `_${relationField.relationName as string}`,
    };
    relations.push(relation);
  } else {
    /* istanbul ignore next */
    if (
      definedAndNotEmpty(relationField.relationFromFields) ||
      definedAndNotEmpty(relationField.relationToFields) ||
      emptyOrUndefined(relatedField.relationFromFields) ||
      emptyOrUndefined(relatedField.relationToFields)
    ) {
      return false;
      // ignored on jest coverage because if prisma validates
      // the schema this condition is always false
    }

    if (
      relatedField.relationFromFields.length > 1 ||
      relatedField.relationToFields.length > 1
    ) {
      throw new CompositeKeyOnRelationError();
    }

    const pivotRelationFields = _.filter(
      relatedModel.fields,
      f =>
        isFieldRelation(f) &&
        f.relationName !== relationField.relationName &&
        f.type !== relatedModel.name,
    );
    for (const pivotRelationField of pivotRelationFields) {
      const relatedPivotModel = getModelByName(pivotRelationField.type, models);

      const relatedPivotField = getRelatedFieldOfRelatedModel(
        relatedModel,
        relatedPivotModel,
        pivotRelationField,
      );

      if (!relatedPivotField.isList) {
        continue;
      }
      /* istanbul ignore next */
      if (
        emptyOrUndefined(pivotRelationField.relationFromFields) ||
        emptyOrUndefined(pivotRelationField.relationToFields) ||
        definedAndNotEmpty(relatedPivotField.relationFromFields) ||
        definedAndNotEmpty(relatedPivotField.relationToFields)
      ) {
        continue;
        // ignored on jest coverage because if prisma validates
        // the schema this condition is always false
      }

      const relatedPivotModelPrimaryKeyField = _.find(
        relatedPivotModel.fields,
        f => f.isId,
      );

      imports.add(getModelFqcn(relatedPivotModel).fqcn);
      imports.add(getModelFqcn(relatedModel).fqcn);
      let relation: BelongsToManyRelation = {
        name: relationField.name,
        className: relatedPivotModel.name,
        using: relatedModel.name,
      };

      // pivot table
      let snakeFrom = snake(model.name);
      let snakeTo = snake(relatedPivotModel.name);
      if (snakeFrom.localeCompare(snakeTo) > 0) {
        [snakeFrom, snakeTo] = [snakeTo, snakeFrom];
      }
      const pivotTable = getTableNameFromModel(relatedModel);
      if (explicitTableNames || pivotTable !== `${snakeFrom}_${snakeTo}`) {
        relation = {
          ...relation,
          pivotTable,
        };
      }

      // foreignPivotKey
      if (
        explicitTableNames ||
        relatedField.relationFromFields[0] !==
          `${snake(model.name)}_${relatedField.relationToFields[0] as string}`
      ) {
        relation = {
          ...relation,
          foreignPivotKey: relatedField.relationFromFields[0],
        };
      }

      // relatedPivotKey
      if (
        explicitTableNames ||
        pivotRelationField.relationFromFields[0] !==
          `${snake(relatedPivotModel.name)}_${
            pivotRelationField.relationToFields[0] as string
          }`
      ) {
        relation = {
          ...relation,
          relatedPivotKey: pivotRelationField.relationFromFields[0],
        };
      }

      if (
        explicitTableNames ||
        relatedField.relationToFields[0] !== (primaryKeyField?.name ?? 'id')
      ) {
        relation = {
          ...relation,
          parentKey: relatedField.relationToFields[0] as string,
        };
      }

      if (
        explicitTableNames ||
        pivotRelationField.relationToFields[0] !==
          (relatedPivotModelPrimaryKeyField?.name ?? 'id')
      ) {
        relation = {
          ...relation,
          relatedKey: pivotRelationField.relationToFields[0] as string,
        };
      }

      relations.push(relation);
    }
  }
  return [relations, imports];
};

const getRelationsFromModel = (
  model: DMMF.Model,
  models: DMMF.Model[],
  explicitTableNames = true,
) => {
  const imports = new Set<string>();

  const hasOne: HasOneRelation[] = [];
  const belongsTo: BelongsToRelation[] = [];
  const hasMany: HasManyRelation[] = [];
  const belongsToMany: BelongsToManyRelation[] = [];

  const relationFields = _.filter(model.fields, f => isFieldRelation(f));

  for (const relationField of relationFields) {
    const relatedModel = getModelByName(relationField.type, models);
    const relatedField = getRelatedFieldOfRelatedModel(
      model,
      relatedModel,
      relationField,
    );

    const hasOneRelation = getHasOneRelation(
      model,
      relationField,
      relatedModel,
      relatedField,
      explicitTableNames,
    );
    if (hasOneRelation) {
      const [relation, newImports] = hasOneRelation;
      hasOne.push(relation);
      for (const newImport of newImports) {
        imports.add(newImport);
      }
      continue;
    }

    const belongsToRelation = getBelongsToRelation(
      model,
      relationField,
      relatedModel,
      relatedField,
      explicitTableNames,
    );
    if (belongsToRelation) {
      const [relation, newImports] = belongsToRelation;
      belongsTo.push(relation);
      for (const newImport of newImports) {
        imports.add(newImport);
      }
      continue;
    }

    const belongsToManyRelation = getBelongsToManyRelation(
      model,
      relationField,
      relatedModel,
      relatedField,
      models,
      explicitTableNames,
    );
    if (belongsToManyRelation) {
      const [relations, newImports] = belongsToManyRelation;
      for (const relation of relations) {
        belongsToMany.push(relation);
      }
      for (const newImport of newImports) {
        imports.add(newImport);
      }
      continue;
    }

    const hasManyRelation = getHasManyRelation(
      model,
      relationField,
      relatedModel,
      relatedField,
      explicitTableNames,
    );
    if (hasManyRelation) {
      const [relation, newImports] = hasManyRelation;
      hasMany.push(relation);
      for (const newImport of newImports) {
        imports.add(newImport);
      }
      continue;
    }
  }

  return {
    imports,
    hasOne,
    belongsTo,
    hasMany,
    belongsToMany,
  };
};

export default getRelationsFromModel;
