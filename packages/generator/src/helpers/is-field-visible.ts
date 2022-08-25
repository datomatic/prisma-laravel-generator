import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldVisible = (field: DMMF.Field) =>
  findOnDocumentation('visible', field.documentation);

export default isFieldVisible;
