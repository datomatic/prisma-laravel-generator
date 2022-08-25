import {getEmptySample, getSample} from '../../__fixtures__/get-sample';
import getFieldLines from '../../../utils/raw-schema/get-field-lines';

test('getFieldLines', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(getFieldLines(modelInfo.name, raw)).toMatchSnapshot(
      `${modelInfo.name}`,
    );
  }
});

test('getFieldLines - Empty schema', async () => {
  const {raw} = await getEmptySample();
  expect(getFieldLines('model', raw)).toBe(false);
});
