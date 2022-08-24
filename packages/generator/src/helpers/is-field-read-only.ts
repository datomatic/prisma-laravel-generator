import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import findOnDocumentation from '../utils/find-on-documentation';
import isFieldUpdatedTimestamp from './is-field-updated-timestamp';
import isFieldCreatedTimestamp from './is-field-created-timestamp';
import isFieldDeletedTimestamp from './is-field-deleted-timestamp';

const isFieldReadOnly = (
  field: DMMF.Field,
  guardedFields: DMMF.Field[],
  fillableFields: DMMF.Field[],
  massAssignable: boolean,
) =>
  findOnDocumentation('read-only', field.documentation) ||
  isFieldCreatedTimestamp(field) ||
  isFieldUpdatedTimestamp(field) ||
  isFieldDeletedTimestamp(field) ||
  (field.isId &&
    !massAssignable &&
    ((_.isEmpty(guardedFields) && _.isEmpty(fillableFields)) ||
      (_.isEmpty(guardedFields) && !_.includes(fillableFields, field)) ||
      _.includes(guardedFields, field)));

export default isFieldReadOnly;
