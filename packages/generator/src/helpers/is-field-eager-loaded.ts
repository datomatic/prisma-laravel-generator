import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';
import isFieldRelation from './is-field-relation';

const isFieldEagerLoaded = (field: DMMF.Field) =>
  isFieldRelation(field) &&
  findOnDocumentation('eager-loaded', field.documentation);

export default isFieldEagerLoaded;
