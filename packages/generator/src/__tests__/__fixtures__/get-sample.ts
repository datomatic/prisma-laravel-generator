import {getDMMF, getSchemaSync} from '@prisma/sdk';
import {join} from 'node:path';
import {readFile} from 'node:fs/promises';

const readSample = async (filename: string) => {
  const path = join(__dirname, `./${filename}`);
  const buffer = await readFile(path);

  const dmmf = await getDMMF({
    datamodel: getSchemaSync(path),
  });

  return {dmmf, raw: buffer.toString()};
};

export const getSample = async () => readSample('sample.prisma');
export const getCompositeKeySample = async () =>
  readSample('composite-key.prisma');
export const getCompositeKeyOnRelationSample = async () =>
  readSample('composite-key-on-relation.prisma');
export const getInvalidTimestampsSample = async () =>
  readSample('invalid-timestamps.prisma');
export const getCuidSample = async () => readSample('cuid.prisma');
export const getMappedFieldsSample = async () =>
  readSample('mapped-fields.prisma');
export const getFillableGuardedConflictSample = async () =>
  readSample('fillable-guarded-conflict.prisma');
export const getHiddenVisibleConflictSample = async () =>
  readSample('hidden-visible-conflict.prisma');
export const getMassAssignableConflictSample = async () =>
  readSample('mass-assignable-conflict.prisma');
export const getEmptySample = async () => readSample('empty.prisma');
export const getMongoSample = async () => readSample('mongo.prisma');
export const getMySqlSample = async () => readSample('mysql.prisma');

export default {
  getSample,
  getCompositeKeySample,
  getCompositeKeyOnRelationSample,
  getInvalidTimestampsSample,
  getCuidSample,
  getMappedFieldsSample,
  getFillableGuardedConflictSample,
  getHiddenVisibleConflictSample,
  getMassAssignableConflictSample,
  getMongoSample,
  getMySqlSample,
};
