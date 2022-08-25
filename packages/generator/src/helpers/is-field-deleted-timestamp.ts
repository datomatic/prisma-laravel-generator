import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldDeletedTimestamp = (field: DMMF.Field) =>
  field.name === 'deleted_at' ||
  findOnDocumentation('deleted_at', field.documentation);

export default isFieldDeletedTimestamp;
