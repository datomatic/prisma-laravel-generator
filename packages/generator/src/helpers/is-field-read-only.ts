import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';
import findOnDocumentation from '../utils/find-on-documentation';
import isFieldUpdatedTimestamp from './is-field-updated-timestamp';
import isFieldCreatedTimestamp from './is-field-created-timestamp';
import isFieldDeletedTimestamp from './is-field-deleted-timestamp';

const isFieldReadOnly = (field: DMMF.Field) =>
  findOnDocumentation('read-only', field.documentation) ||
  isFieldCreatedTimestamp(field) ||
  isFieldUpdatedTimestamp(field) ||
  isFieldDeletedTimestamp(field);

export default isFieldReadOnly;
