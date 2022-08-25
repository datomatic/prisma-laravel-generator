import {DMMF} from '@prisma/generator-helper';
import {map, replace} from 'lodash';
import getFromDocumentation from '../utils/get-from-documentation';

const getModelTraits = (model: DMMF.Model | DMMF.DatamodelEnum) => {
  const traits = getFromDocumentation(/^trait:.*/gi, model.documentation);

  return map(traits, t => replace(t, /^trait:/gi, ''));
};

export default getModelTraits;
