import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';

const isFieldUuid = (field: DMMF.Field) => {
  return (
    typeof field.default === 'object' &&
    !_.isArray(field.default) &&
    field.default.name === 'uuid'
  );
};

export default isFieldUuid;
