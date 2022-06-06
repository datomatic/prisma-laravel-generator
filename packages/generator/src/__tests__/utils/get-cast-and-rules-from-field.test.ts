import {getMySqlSample, getSample} from '../__fixtures__/get-sample';
import getCastAndRulesFromField from '../../utils/get-cast-and-rules-from-field';

test('getCastAndRulesFromField', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getCastAndRulesFromField(
          fieldInfo,
          modelInfo,
          dmmf.datamodel.enums,
          raw,
        ),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});

test('getCastAndRulesFromField - mysql', async () => {
  const {dmmf, raw} = await getMySqlSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getCastAndRulesFromField(
          fieldInfo,
          modelInfo,
          dmmf.datamodel.enums,
          raw,
          'mysql',
        ),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
