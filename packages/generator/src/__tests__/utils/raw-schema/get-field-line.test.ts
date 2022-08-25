import getFieldLine from '../../../utils/raw-schema/get-field-line';
import {getEmptySample, getSample} from '../../__fixtures__/get-sample';

test('getFieldLine', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(getFieldLine(fieldInfo.name, modelInfo.name, raw)).toMatchSnapshot(
        `${modelInfo.name} - ${fieldInfo.name}`,
      );
    }
  }
});

test('getFieldLine - Empty schema', async () => {
  const {raw} = await getEmptySample();
  expect(getFieldLine('field', 'model', raw)).toBe(false);
});
