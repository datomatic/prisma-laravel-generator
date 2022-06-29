import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';
import isFieldRelation from './is-field-relation';

const isFieldTouching = (field: DMMF.Field) =>
  isFieldRelation(field) && findOnDocumentation('touch', field.documentation);

export default isFieldTouching;
