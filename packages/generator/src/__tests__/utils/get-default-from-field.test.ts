import {getMongoSample, getSample} from '../__fixtures__/get-sample';
import getDefaultFromField from '../../utils/get-default-from-field';

test('getDefaultFromField', async () => {
  const {dmmf} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getDefaultFromField(fieldInfo, dmmf.datamodel.enums),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});

test('getDefaultFromField - mongodb', async () => {
  const {dmmf} = await getMongoSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getDefaultFromField(fieldInfo, dmmf.datamodel.enums, 'mongodb'),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
