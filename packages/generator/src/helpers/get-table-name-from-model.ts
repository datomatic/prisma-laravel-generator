import {DMMF} from '@prisma/generator-helper';

const getTableNameFromModel = (model: DMMF.Model) => {
  return model.dbName ?? model.name;
};

export default getTableNameFromModel;
