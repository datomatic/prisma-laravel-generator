// Inspired by:
// https://github.com/iiian/prisma-generator-entityframework/blob/master/packages/generator/src/helpers/rawSchema/getMappedFieldLine.ts

import getModelLines from './get-model-lines';

const fieldMatcher =
  /((\/{3}[\t ]*[^\n]*\n\s*)*)([^\s/]+)\s+(([^\s"/]*("[^"]*")?)+)((\s+@[^\n/]+)*)([\t ]*(\/{3}[\t ]*([^\n]*)\s*)?)\s*/gm;

const getFieldLines = (
  modelName: string,
  rawContent: string,
):
  | false
  | {
      id: string;
      type: string;
      attributes: string | undefined;
      comment: string | undefined;
    }[] => {
  const fields = getModelLines(modelName, rawContent);
  if (!fields) {
    return false;
  }

  fieldMatcher.lastIndex = 0;
  let fieldRow = fieldMatcher.exec(fields);
  const result = [];

  while (fieldRow) {
    const id = fieldRow[3];
    const type = fieldRow[4];
    const attributes = fieldRow[7]
      ? fieldRow[7].trim().replaceAll(/\s+/g, ' ')
      : undefined;

    let comment =
      fieldRow[1] && fieldRow[1].length > 0 ? fieldRow[1] : undefined;
    if (fieldRow[11]) {
      if (comment) {
        comment += ` ${fieldRow[11]}`;
      } else {
        comment = `${fieldRow[11]}`;
      }
    }
    if (comment) {
      comment = comment.replaceAll(/\/+/g, ' ').replaceAll(/\s+/g, ' ').trim();
    }

    result.push({id, type, attributes, comment});

    fieldRow = fieldMatcher.exec(fields);
  }

  return result;
};

export default getFieldLines;
