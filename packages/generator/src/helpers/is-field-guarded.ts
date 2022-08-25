import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldGuarded = (field: DMMF.Field) =>
  findOnDocumentation('guarded', field.documentation);

export default isFieldGuarded;
