import {getSample} from '../../__fixtures__/get-sample';
import getDatabaseFieldAttribute from '../../../utils/raw-schema/get-database-field-attribute';

test('getDatabaseFieldAnnotation', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getDatabaseFieldAttribute(fieldInfo.name, modelInfo.name, raw),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
