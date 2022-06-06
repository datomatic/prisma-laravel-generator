import {DMMF} from '@prisma/generator-helper';

const isFieldEnum = (
  field: DMMF.Field,
  enums: DMMF.DatamodelEnum[],
): DMMF.DatamodelEnum | undefined => {
  return enums.find(enumFound => enumFound.name === field.type);
};

export default isFieldEnum;
