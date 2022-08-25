import {DMMF} from '@prisma/generator-helper';
import {last, map, replace} from 'lodash';
import getFromDocumentation from '../utils/get-from-documentation';
import MultipleInheritanceError from '../errors/multiple-inheritance-error';

const getModelExtend = (model: DMMF.Model | DMMF.DatamodelEnum) => {
  const extend = getFromDocumentation(/^extends:.*/gi, model.documentation);

  const classes = map(extend, t => replace(t, /^extends:/gi, ''));

  if (classes.length > 1) {
    throw new MultipleInheritanceError();
  }

  return last(classes);
};

export default getModelExtend;
