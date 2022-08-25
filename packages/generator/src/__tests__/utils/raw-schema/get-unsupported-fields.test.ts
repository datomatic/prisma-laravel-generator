import {getEmptySample, getSample} from '../../__fixtures__/get-sample';
import getUnsupportedFields from '../../../utils/raw-schema/get-unsupported-fields';

test('getUnsupportedFields', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(getUnsupportedFields(modelInfo.name, raw)).toMatchSnapshot(
      `${modelInfo.name}`,
    );
  }
});

test('getUnsupportedFields - Empty schema', async () => {
  const {raw} = await getEmptySample();
  expect(getUnsupportedFields('model', raw)).toBe(false);
});
