import {DMMF} from '@prisma/generator-helper';
import {map, replace} from 'lodash';
import getFromDocumentation from '../utils/get-from-documentation';

const getModelTraits = (model: DMMF.Model | DMMF.DatamodelEnum) => {
  const traits = getFromDocumentation(/trait:.*/g, model.documentation);

  return map(traits, t => replace(t, /trait:/g, ''));
};

export default getModelTraits;
