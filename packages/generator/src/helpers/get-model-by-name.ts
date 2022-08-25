import {DMMF} from '@prisma/generator-helper';
import {find} from 'lodash';
import ModelNotFoundError from '../errors/model-not-found-error';

const getModelByName = (name: string, models: DMMF.Model[]) => {
  const model = find(models, m => m.name === name);
  if (!model) {
    throw new ModelNotFoundError();
  }
  return model;
};

export default getModelByName;
