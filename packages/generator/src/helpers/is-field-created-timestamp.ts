import {DMMF} from '@prisma/generator-helper';
import findOnDocumentation from '../utils/find-on-documentation';

const isFieldCreatedTimestamp = (field: DMMF.Field) =>
  field.name === 'created_at' ||
  findOnDocumentation('created_at', field.documentation);

export default isFieldCreatedTimestamp;
