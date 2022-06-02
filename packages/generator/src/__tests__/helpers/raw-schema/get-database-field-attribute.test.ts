import {getRawSample} from '../../__fixtures__/get-raw-sample';
import {getSampleDmmf} from '../../__fixtures__/get-sample-dmmf';
import getDatabaseFieldAttribute from '../../../helpers/raw-schema/get-database-field-attribute';

test('getDatabaseFieldAnnotation', async () => {
  const raw = await getRawSample();
  const sampleDMMF = await getSampleDmmf();

  for (const modelInfo of sampleDMMF.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getDatabaseFieldAttribute(fieldInfo.name, modelInfo.name, raw),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
