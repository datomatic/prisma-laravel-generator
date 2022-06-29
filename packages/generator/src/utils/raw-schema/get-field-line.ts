import _ from 'lodash';
import getFieldLines from './get-field-lines';

const getFieldLine = (
  fieldName: string,
  modelName: string,
  rawContent: string,
):
  | false
  | {
      id: string;
      type: string;
      attributes: string | undefined;
      comment: string | undefined;
    } => {
  const fields = getFieldLines(modelName, rawContent);
  if (!fields) {
    return false;
  }

  return _.find(fields, f => f.id === fieldName) ?? false;
};

export default getFieldLine;
