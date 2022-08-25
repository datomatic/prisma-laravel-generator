import {getSample} from '../../__fixtures__/get-sample';
import getDefaultFieldAttribute from '../../../utils/raw-schema/get-default-field-attribute';

test('getDefaultFieldAnnotation', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getDefaultFieldAttribute(fieldInfo.name, modelInfo.name, raw),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
