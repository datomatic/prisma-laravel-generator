import _ from 'lodash';
import {getSample} from '../__fixtures__/get-sample';
import getRelationsFromModel, {
  getBelongsToManyRelation,
  getBelongsToRelation,
  getHasManyRelation,
  getHasOneRelation,
} from '../../utils/get-relations-from-model';
import isFieldRelation from '../../helpers/is-field-relation';
import getModelByName from '../../helpers/get-model-by-name';
import getRelatedFieldOfRelatedModel from '../../helpers/get-related-field-of-related-model';

test('getRelationsFromModel', async () => {
  const {dmmf} = await getSample();

  for (const model of dmmf.datamodel.models) {
    expect(getRelationsFromModel(model, dmmf.datamodel.models)).toMatchSnapshot(
      `${model.name}`,
    );
  }
});

test('getRelationsFromModel - implicit table names', async () => {
  const {dmmf} = await getSample();

  for (const model of dmmf.datamodel.models) {
    expect(
      getRelationsFromModel(model, dmmf.datamodel.models, false),
    ).toMatchSnapshot(`${model.name}`);
  }
});

test('getHasOneRelation', async () => {
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

      expect(
        getHasOneRelation(model, relationField, relatedModel, relatedField),
      ).toMatchSnapshot(`${model.name} - ${relationField.name}`);
    }
  }
});

test('getHasOneRelation - implicit table names', async () => {
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

      expect(
        getHasOneRelation(
          model,
          relationField,
          relatedModel,
          relatedField,
          false,
        ),
      ).toMatchSnapshot(`${model.name} - ${relationField.name}`);
    }
  }
});

test('getBelongsToRelation', async () => {
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

      expect(
        getBelongsToRelation(model, relationField, relatedModel, relatedField),
      ).toMatchSnapshot(`${model.name} - ${relationField.name}`);
    }
  }
});

test('getBelongsToRelation - implicit table names', async () => {
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

      expect(
        getBelongsToRelation(
          model,
          relationField,
          relatedModel,
          relatedField,
          false,
        ),
      ).toMatchSnapshot(`${model.name} - ${relationField.name}`);
    }
  }
});

test('getBelongsToManyRelation', async () => {
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

      expect(
        getBelongsToManyRelation(
          model,
          relationField,
          relatedModel,
          relatedField,
          dmmf.datamodel.models,
        ),
      ).toMatchSnapshot(`${model.name} - ${relationField.name}`);
    }
  }
});

test('getBelongsToManyRelation - implicit table names', async () => {
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

      expect(
        getBelongsToManyRelation(
          model,
          relationField,
          relatedModel,
          relatedField,
          dmmf.datamodel.models,
          false,
        ),
      ).toMatchSnapshot(`${model.name} - ${relationField.name}`);
    }
  }
});

test('getHasManyRelation', async () => {
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

      expect(
        getHasManyRelation(model, relationField, relatedModel, relatedField),
      ).toMatchSnapshot(`${model.name} - ${relationField.name}`);
    }
  }
});

test('getHasManyRelation - implicit table names', async () => {
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

      expect(
        getHasManyRelation(
          model,
          relationField,
          relatedModel,
          relatedField,
          false,
        ),
      ).toMatchSnapshot(`${model.name} - ${relationField.name}`);
    }
  }
});
