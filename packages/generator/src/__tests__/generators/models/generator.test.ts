import {
  getCompositeKeySample,
  getCuidSample,
  getFillableGuardedConflictSample,
  getHiddenVisibleConflictSample,
  getInvalidTimestampsSample,
  getMappedFieldsSample,
  getMassAssignableConflictSample,
  getMongoSample,
  getMySqlSample,
  getSample,
} from '../../__fixtures__/get-sample';
import {format} from '../../../utils/php-cs-fixer';
import generateModel from '../../../generators/models/generator';
import CompositeKeyError from '../../../errors/composite-key-error';
import InvalidLaravelTimestampsError from '../../../errors/invalid-laravel-timestamps-error';
import CuidNotSupportedError from '../../../errors/cuid-not-supported-error';
import MappedFieldError from '../../../errors/mapped-field-error';
import MassAssignableConflictError from '../../../errors/mass-assignable-conflict-error';
import HiddenVisibleConflictError from '../../../errors/hidden-visible-conflict-error';
import FillableGuardedConflictError from '../../../errors/fillable-guarded-conflict-error';

test('models: generation', async () => {
  const {dmmf, raw} = await getSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generateModel(modelInfo, dmmf.datamodel.enums, raw),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('models: generation - mongodb', async () => {
  const {dmmf, raw} = await getMongoSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generateModel(modelInfo, dmmf.datamodel.enums, raw, 'mongodb'),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('models: generation - mysql', async () => {
  const {dmmf, raw} = await getMySqlSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generateModel(modelInfo, dmmf.datamodel.enums, raw, 'mysql'),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('models: composite-key', async () => {
  const {dmmf, raw} = await getCompositeKeySample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() => generateModel(modelInfo, dmmf.datamodel.enums, raw)).toThrow(
      CompositeKeyError,
    );
  }
});

test('models: invalid timestamps', async () => {
  const {dmmf, raw} = await getInvalidTimestampsSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() => generateModel(modelInfo, dmmf.datamodel.enums, raw)).toThrow(
      InvalidLaravelTimestampsError,
    );
  }
});

test('models: cuid', async () => {
  const {dmmf, raw} = await getCuidSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() => generateModel(modelInfo, dmmf.datamodel.enums, raw)).toThrow(
      CuidNotSupportedError,
    );
  }
});

test('models: mapped fields', async () => {
  const {dmmf, raw} = await getMappedFieldsSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() => generateModel(modelInfo, dmmf.datamodel.enums, raw)).toThrow(
      MappedFieldError,
    );
  }
});

test('models: fillable guarded conflict', async () => {
  const {dmmf, raw} = await getFillableGuardedConflictSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() => generateModel(modelInfo, dmmf.datamodel.enums, raw)).toThrow(
      FillableGuardedConflictError,
    );
  }
});

test('models: hidden visible conflict', async () => {
  const {dmmf, raw} = await getHiddenVisibleConflictSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() => generateModel(modelInfo, dmmf.datamodel.enums, raw)).toThrow(
      HiddenVisibleConflictError,
    );
  }
});

test('models: mass assignable conflict', async () => {
  const {dmmf, raw} = await getMassAssignableConflictSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() => generateModel(modelInfo, dmmf.datamodel.enums, raw)).toThrow(
      MassAssignableConflictError,
    );
  }
});
