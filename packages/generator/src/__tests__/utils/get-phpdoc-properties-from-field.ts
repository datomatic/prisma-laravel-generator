import _ from 'lodash';
import {getSample} from '../__fixtures__/get-sample';
import getPhpDocumentPropertiesFromField from '../../utils/get-phpdoc-properties-from-field';
import isFieldFillable from '../../helpers/is-field-fillable';
import isFieldGuarded from '../../helpers/is-field-guarded';
import isModelMassAssignable from '../../helpers/is-model-mass-assignable';
import isModelPivot from '../../helpers/is-model-pivot';

test('getPhpDocPropertiesFromField', async () => {
  const {dmmf} = await getSample();

  for (const modelInfo of dmmf.datamodel.models) {
    const massAssignable = isModelMassAssignable(modelInfo);
    const isPivot = isModelPivot(modelInfo);
    const fillableFields = _.filter(modelInfo.fields, f => isFieldFillable(f));
    const guardedFields = _.filter(modelInfo.fields, f => isFieldGuarded(f));
    for (const fieldInfo of modelInfo.fields) {
      expect(
        getPhpDocumentPropertiesFromField(
          fieldInfo,
          dmmf.datamodel.enums,
          guardedFields,
          fillableFields,
          massAssignable,
          isPivot,
        ),
      ).toMatchSnapshot(`${modelInfo.name} - ${fieldInfo.name}`);
    }
  }
});
