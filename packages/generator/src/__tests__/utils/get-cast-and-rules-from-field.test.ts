import _ from 'lodash';
import {getMySqlSample, getSample} from '../__fixtures__/get-sample';
import getCastAndRulesFromField from '../../utils/get-cast-and-rules-from-field';
import isModelMassAssignable from '../../helpers/is-model-mass-assignable';
import isFieldFillable from '../../helpers/is-field-fillable';
import isFieldGuarded from '../../helpers/is-field-guarded';

test('getCastAndRulesFromField', async () => {
  const {dmmf, raw} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    for (const fieldInfo of modelInfo.fields) {
      const massAssignable = isModelMassAssignable(modelInfo);
      const fillableFields = _.filter(modelInfo.fields, f =>
        isFieldFillable(f),
      );
      const guardedFields = _.filter(modelInfo.fields, f => isFieldGuarded(f));

      expect(
        getCastAndRulesFromField(
          fieldInfo,
          modelInfo,
          dmmf.datamodel.enums,
          guardedFields,
          fillableFields,
          massAssignable,
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
      const massAssignable = isModelMassAssignable(modelInfo);
      const fillableFields = _.filter(modelInfo.fields, f =>
        isFieldFillable(f),
      );
      const guardedFields = _.filter(modelInfo.fields, f => isFieldGuarded(f));

      expect(
        getCastAndRulesFromField(
          fieldInfo,
          modelInfo,
          dmmf.datamodel.enums,
          guardedFields,
          fillableFields,
          massAssignable,
          raw,
          'mysql',
        ),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
