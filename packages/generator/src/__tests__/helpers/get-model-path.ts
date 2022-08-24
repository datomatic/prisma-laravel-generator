import getModelPath from '../../helpers/get-model-path';
import {getMultiplePathsSample, getSample} from '../__fixtures__/get-sample';
import TooManyPathsError from '../../errors/too-many-paths-error';

test('getModelPath: samples', async () => {
  const {dmmf} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(getModelPath(modelInfo)).toMatchSnapshot(`model_${modelInfo.name}`);
  }
  for (const enumInfo of dmmf.datamodel.enums) {
    expect(getModelPath(enumInfo)).toMatchSnapshot(`enum_${enumInfo.name}`);
  }
});

test('getModelPath: multiple paths', async () => {
  const {dmmf} = await getMultiplePathsSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() => getModelPath(modelInfo)).toThrow(TooManyPathsError);
  }
});
