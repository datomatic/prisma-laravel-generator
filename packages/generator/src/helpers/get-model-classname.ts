import {DMMF} from '@prisma/generator-helper';
import {singular} from 'pluralize';
import ucwords from '../utils/strings/ucwords';

const getModelClassName = (model: DMMF.Model, prefix?: string) => {
  return singular(
    ucwords(
      `${prefix ? `${prefix} ` : ''}${model.name.replace(/_+/g, ' ')}`,
    ).replace(/\s+/g, ''),
  );
};

export default getModelClassName;
