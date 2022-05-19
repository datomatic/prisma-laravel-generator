import generateEnum from '../../../generators/enums/generator';
import getSampleDmmf from '../../__fixtures__/get-sample-dmmf';

test('enum generation', async () => {
  const sampleDMMF = await getSampleDmmf();

  for (let index = 0; index < sampleDMMF.datamodel.enums.length; index += 1) {
    const enumInfo = sampleDMMF.datamodel.enums[index];
    expect(generateEnum(enumInfo)).toMatchSnapshot(enumInfo.name);
  }
});
