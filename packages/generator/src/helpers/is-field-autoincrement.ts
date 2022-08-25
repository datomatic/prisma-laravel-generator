import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';

const isFieldAutoincrement = (field: DMMF.Field) => {
  return (
    typeof field.default === 'object' &&
    !_.isArray(field.default) &&
    field.default.name === 'autoincrement'
  );
};

export default isFieldAutoincrement;
