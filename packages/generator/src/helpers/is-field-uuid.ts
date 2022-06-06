import {DMMF} from '@prisma/generator-helper';

const isFieldUuid = (field: DMMF.Field) => {
  return typeof field.default === 'object' && field.default.name === 'uuid';
};

export default isFieldUuid;
