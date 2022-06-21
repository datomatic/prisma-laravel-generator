import {DMMF} from '@prisma/generator-helper';

const isFieldRelation = (field: DMMF.Field) => field.isGenerated;

export default isFieldRelation;
