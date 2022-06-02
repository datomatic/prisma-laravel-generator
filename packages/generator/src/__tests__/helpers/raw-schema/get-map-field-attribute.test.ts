import {getRawSample} from '../../__fixtures__/get-raw-sample';
import {getSampleDmmf} from '../../__fixtures__/get-sample-dmmf';
import getMapFieldAttribute from '../../../helpers/raw-schema/get-map-field-attribute';

test('getMapFieldAnnotation', async () => {
  const raw = await getRawSample();
  const sampleDMMF = await getSampleDmmf();

  for (const modelInfo of sampleDMMF.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getMapFieldAttribute(fieldInfo.name, modelInfo.name, raw),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
