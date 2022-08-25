import {DMMF} from '@prisma/generator-helper';

const isFieldCuid = (field: DMMF.Field) => {
  return typeof field.default === 'object' && field.default.name === 'cuid';
};

export default isFieldCuid;
