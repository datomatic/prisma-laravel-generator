import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldReadOnly = (field: DMMF.Field) =>
  findOnDocumentation('read-only', field.documentation);

export default isFieldReadOnly;
