import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldUpdatedTimestamp = (field: DMMF.Field) =>
  findOnDocumentation('updated_at', field.documentation) || !!field.isUpdatedAt;

export default isFieldUpdatedTimestamp;
