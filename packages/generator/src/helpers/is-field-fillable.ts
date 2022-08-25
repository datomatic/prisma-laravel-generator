import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldFillable = (field: DMMF.Field) =>
  findOnDocumentation('fillable', field.documentation);

export default isFieldFillable;
