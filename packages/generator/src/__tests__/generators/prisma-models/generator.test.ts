import _ from 'lodash';
import {
  getCompositeKeyOnRelationSample,
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
import generatePrismaModel from '../../../generators/prisma-models/generator';
import CompositeKeyError from '../../../errors/composite-key-error';
import InvalidLaravelTimestampsError from '../../../errors/invalid-laravel-timestamps-error';
import CuidNotSupportedError from '../../../errors/cuid-not-supported-error';
import MappedFieldError from '../../../errors/mapped-field-error';
import MassAssignableConflictError from '../../../errors/mass-assignable-conflict-error';
import HiddenVisibleConflictError from '../../../errors/hidden-visible-conflict-error';
import FillableGuardedConflictError from '../../../errors/fillable-guarded-conflict-error';
import CompositeKeyOnRelationError from '../../../errors/composite-key-on-relation-error';
import isModelPivot from '../../../helpers/is-model-pivot';

jest.setTimeout(60_000);

test('prisma-models: generation', async () => {
  const {dmmf, raw} = await getSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generatePrismaModel(
            modelInfo,
            dmmf.datamodel.models,
            dmmf.datamodel.enums,
            raw,
          ),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('prisma-models: generation without explicit table names on relations', async () => {
  const {dmmf, raw} = await getSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generatePrismaModel(
            modelInfo,
            dmmf.datamodel.models,
            dmmf.datamodel.enums,
            raw,
            undefined,
            'Illuminate\\Database\\Eloquent\\Model',
            'Illuminate\\Database\\Eloquent\\Relations\\Pivot',
            'Prisma',
            false,
          ),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('prisma-models: generation with different prefix', async () => {
  const {dmmf, raw} = await getSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generatePrismaModel(
            modelInfo,
            dmmf.datamodel.models,
            dmmf.datamodel.enums,
            raw,
            undefined,
            'Illuminate\\Database\\Eloquent\\Model',
            'Illuminate\\Database\\Eloquent\\Relations\\Pivot',
            'AnotherPrefix',
          ),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('prisma-models: generation - mongodb', async () => {
  const {dmmf, raw} = await getMongoSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generatePrismaModel(
            modelInfo,
            dmmf.datamodel.models,
            dmmf.datamodel.enums,
            raw,
            'mongodb',
          ),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('prisma-models: generation - mysql', async () => {
  const {dmmf, raw} = await getMySqlSample();

  await Promise.all(
    dmmf.datamodel.models.map(async modelInfo => {
      expect(
        await format(
          generatePrismaModel(
            modelInfo,
            dmmf.datamodel.models,
            dmmf.datamodel.enums,
            raw,
            'mysql',
          ),
          './../usage/tools/php-cs-fixer/vendor/bin/php-cs-fixer',
          './../usage/tools/php-cs-fixer/.php-cs.dist.php',
        ),
      ).toMatchSnapshot(modelInfo.name);
    }),
  );
});

test('prisma-models: composite-key', async () => {
  const {dmmf, raw} = await getCompositeKeySample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() =>
      generatePrismaModel(
        modelInfo,
        dmmf.datamodel.models,
        dmmf.datamodel.enums,
        raw,
      ),
    ).toThrow(CompositeKeyError);
  }
});

test('prisma-models: invalid timestamps', async () => {
  const {dmmf, raw} = await getInvalidTimestampsSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() =>
      generatePrismaModel(
        modelInfo,
        dmmf.datamodel.models,
        dmmf.datamodel.enums,
        raw,
      ),
    ).toThrow(InvalidLaravelTimestampsError);
  }
});

test('prisma-models: cuid', async () => {
  const {dmmf, raw} = await getCuidSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() =>
      generatePrismaModel(
        modelInfo,
        dmmf.datamodel.models,
        dmmf.datamodel.enums,
        raw,
      ),
    ).toThrow(CuidNotSupportedError);
  }
});

test('prisma-models: mapped fields', async () => {
  const {dmmf, raw} = await getMappedFieldsSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() =>
      generatePrismaModel(
        modelInfo,
        dmmf.datamodel.models,
        dmmf.datamodel.enums,
        raw,
      ),
    ).toThrow(MappedFieldError);
  }
});

test('prisma-models: fillable guarded conflict', async () => {
  const {dmmf, raw} = await getFillableGuardedConflictSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() =>
      generatePrismaModel(
        modelInfo,
        dmmf.datamodel.models,
        dmmf.datamodel.enums,
        raw,
      ),
    ).toThrow(FillableGuardedConflictError);
  }
});

test('prisma-models: hidden visible conflict', async () => {
  const {dmmf, raw} = await getHiddenVisibleConflictSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() =>
      generatePrismaModel(
        modelInfo,
        dmmf.datamodel.models,
        dmmf.datamodel.enums,
        raw,
      ),
    ).toThrow(HiddenVisibleConflictError);
  }
});

test('prisma-models: mass assignable conflict', async () => {
  const {dmmf, raw} = await getMassAssignableConflictSample();

  for (const modelInfo of dmmf.datamodel.models) {
    expect(() =>
      generatePrismaModel(
        modelInfo,
        dmmf.datamodel.models,
        dmmf.datamodel.enums,
        raw,
      ),
    ).toThrow(MassAssignableConflictError);
  }
});

test('prisma-models: composite key on relation', async () => {
  const {dmmf, raw} = await getCompositeKeyOnRelationSample();

  for (const modelInfo of _.filter(
    dmmf.datamodel.models,
    m => !isModelPivot(m),
  )) {
    expect(() =>
      generatePrismaModel(
        modelInfo,
        dmmf.datamodel.models,
        dmmf.datamodel.enums,
        raw,
      ),
    ).toThrow(CompositeKeyOnRelationError);
  }
});
