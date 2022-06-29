import {getEmptySample, getSample} from '../../__fixtures__/get-sample';
import getModelLines from '../../../utils/raw-schema/get-model-lines';

test('getModelLines', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(getModelLines(modelInfo.name, raw)).toMatchSnapshot(
      `${modelInfo.name}`,
    );
  }
});

test('getModelLines - Empty schema', async () => {
  const {raw} = await getEmptySample();
  expect(getModelLines('model', raw)).toBe(false);
});
