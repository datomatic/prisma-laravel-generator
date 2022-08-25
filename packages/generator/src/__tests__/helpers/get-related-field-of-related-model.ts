import _, {clone} from 'lodash';
import {getSample} from '../__fixtures__/get-sample';
import getModelByName from '../../helpers/get-model-by-name';
import getRelatedFieldOfRelatedModel from '../../helpers/get-related-field-of-related-model';
import isFieldRelation from '../../helpers/is-field-relation';
import FieldNotFoundError from '../../errors/field-not-found-error';

test('getRelatedFieldOfRelatedModel', async () => {
  const {dmmf} = await getSample();

  for (const model of dmmf.datamodel.models) {
    const relationFields = _.filter(model.fields, f => isFieldRelation(f));

    for (const relationField of relationFields) {
      const relatedModel = getModelByName(
        relationField.type,
        dmmf.datamodel.models,
      );
      const relatedField = getRelatedFieldOfRelatedModel(
        model,
        relatedModel,
        relationField,
      );
      expect(relatedField.relationName).toBe(relationField.relationName);
      expect(relatedField.type).toBe(model.name);
    }
  }
});

test('getRelatedFieldOfRelatedModel - Related field not found', async () => {
  const {dmmf} = await getSample();

  for (const model of dmmf.datamodel.models) {
    const relationFields = _.filter(model.fields, f => isFieldRelation(f));

    for (const relationField of relationFields) {
      const relatedModel = getModelByName(
        relationField.type,
        dmmf.datamodel.models,
      );
      const wrongRelationField = clone(relationField);
      wrongRelationField.relationName =
        'Invalid-Relation-Name-Not-Available-In-The-Schema';

      expect(() =>
        getRelatedFieldOfRelatedModel(model, relatedModel, wrongRelationField),
      ).toThrow(FieldNotFoundError);
    }
  }
});
