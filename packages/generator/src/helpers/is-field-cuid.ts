import {DMMF} from '@prisma/generator-helper';
import _ from 'lodash';

const isFieldCuid = (field: DMMF.Field) => {
  return (
    typeof field.default === 'object' &&
    !_.isArray(field.default) &&
    field.default.name === 'cuid'
  );
};

export default isFieldCuid;
