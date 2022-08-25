import {DMMF} from '@prisma/generator-helper';
import _, {find} from 'lodash';
import isFieldRelation from './is-field-relation';
import FieldNotFoundError from '../errors/field-not-found-error';

const getRelatedFieldOfRelatedModel = (
  model: DMMF.Model,
  relatedModel: DMMF.Model,
  relationField: DMMF.Field,
) => {
  const field = find(
    _.filter(relatedModel.fields, f => isFieldRelation(f)),
    relation => {
      if (relatedModel.name === model.name) {
        return (
          relation.relationName === relationField.relationName &&
          relation.name !== relationField.name
        );
      }
      return relation.relationName === relationField.relationName;
    },
  );

  if (!field) {
    throw new FieldNotFoundError();
  }

  return field;
};

export default getRelatedFieldOfRelatedModel;
