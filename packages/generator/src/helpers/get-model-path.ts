import {DMMF} from '@prisma/generator-helper';
import {last, map, replace} from 'lodash';
import getFromDocumentation from '../utils/get-from-documentation';
import TooManyPathsError from '../errors/too-many-paths-error';

const getModelPath = (model: DMMF.Model | DMMF.DatamodelEnum) => {
  const documentation = getFromDocumentation(/^path:.*/gi, model.documentation);

  const paths = map(documentation, d => replace(d, /^path:/gi, ''));

  if (paths.length > 1) {
    throw new TooManyPathsError();
  }

  return last(paths);
};

export default getModelPath;
