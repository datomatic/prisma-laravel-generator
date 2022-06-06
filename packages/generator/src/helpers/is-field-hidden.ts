import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldHidden = (field: DMMF.Field) =>
  findOnDocumentation('hidden', field.documentation);

export default isFieldHidden;
