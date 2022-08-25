import {getMappedFieldsSample, getSample} from '../../__fixtures__/get-sample';
import getMapFieldAttribute from '../../../utils/raw-schema/get-map-field-attribute';

test('getMapFieldAnnotation: not mapped fields', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getMapFieldAttribute(fieldInfo.name, modelInfo.name, raw),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});

test('getMapFieldAnnotation: mapped fields', async () => {
  const {dmmf, raw} = await getMappedFieldsSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getMapFieldAttribute(fieldInfo.name, modelInfo.name, raw),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
