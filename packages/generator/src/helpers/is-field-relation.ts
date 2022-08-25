import {DMMF} from '@prisma/generator-helper';

const isFieldRelation = (field: DMMF.Field) => field.kind === 'object';

export default isFieldRelation;
