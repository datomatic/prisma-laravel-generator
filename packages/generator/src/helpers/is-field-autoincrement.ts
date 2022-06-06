import {DMMF} from '@prisma/generator-helper';

const isFieldAutoincrement = (field: DMMF.Field) => {
  return (
    typeof field.default === 'object' && field.default.name === 'autoincrement'
  );
};

export default isFieldAutoincrement;
