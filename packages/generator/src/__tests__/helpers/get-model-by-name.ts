import {getSample} from '../__fixtures__/get-sample';
import getModelByName from '../../helpers/get-model-by-name';
import ModelNotFoundError from '../../errors/model-not-found-error';

test('getModelByName', async () => {
  const {dmmf} = await getSample();

  for (const model of dmmf.datamodel.models) {
    expect(getModelByName(model.name, dmmf.datamodel.models).name).toBe(
      model.name,
    );
  }
});

test('getModelByName - Invalid Name', async () => {
  const {dmmf} = await getSample();

  expect(() =>
    getModelByName(
      'Invalid name not available in the schema',
      dmmf.datamodel.models,
    ),
  ).toThrow(ModelNotFoundError);
});
