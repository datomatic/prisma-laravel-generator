import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldUpdatedTimestamp = (field: DMMF.Field) =>
  field.name === 'updated_at' ||
  findOnDocumentation('updated_at', field.documentation) ||
  !!field.isUpdatedAt;

export default isFieldUpdatedTimestamp;
