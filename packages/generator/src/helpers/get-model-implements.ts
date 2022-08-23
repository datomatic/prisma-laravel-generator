import {DMMF} from '@prisma/generator-helper';
import {map, replace} from 'lodash';
import getFromDocumentation from '../utils/get-from-documentation';

const getModelImplements = (model: DMMF.Model | DMMF.DatamodelEnum) => {
  const implementClasses = getFromDocumentation(
    /implements:.*/g,
    model.documentation,
  );

  return map(implementClasses, t => replace(t, /implements:/g, ''));
};

export default getModelImplements;
