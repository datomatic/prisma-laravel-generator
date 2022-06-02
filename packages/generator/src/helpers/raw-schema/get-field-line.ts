// Inspired by:
// https://github.com/iiian/prisma-generator-entityframework/blob/master/packages/generator/src/helpers/rawSchema/getMappedFieldLine.ts

const modelRegexp = (modelName: string) =>
  new RegExp(`(\\s+|^)model\\s+${modelName}\\s*\\{([^}]*)}`, 'gm');
const commentsMatcher = /(?<!\/)\/\/[^\n/]+/gm;
const modelAttributesMatcher = /@@\S+/gm;
const fieldMatcher =
  /(\/{3}\s*([^\n]*)\n\s*)?(\S+)\s+(\S+)((\s+@[^\n/]+)*)\s+(\/{3}\s*([^\n]*)\s*)?/gm;

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
  const modelSection = modelRegexp(modelName).exec(rawContent);
  if (!modelSection || modelSection.length < 2) {
    return false;
  }

  const fields = `${modelSection[2]
    .replaceAll(modelAttributesMatcher, '')
    .replaceAll(commentsMatcher, '')}\n`;

  let fieldRow = fieldMatcher.exec(fields);

  while (fieldRow) {
    const id = fieldRow[3];
    if (id === fieldName) {
      const type = fieldRow[4];
      const attributes = fieldRow[5]
        ? fieldRow[5].trim().replaceAll(/\s+/g, ' ')
        : undefined;

      let comment = fieldRow[2] ?? undefined;
      if (fieldRow[8]) {
        if (comment) {
          comment += ` ${fieldRow[8]}`;
        } else {
          comment = fieldRow[8] ?? undefined;
        }
      }
      if (comment) {
        comment = comment.replaceAll(/\s+/g, ' ');
      }

      return {id, type, attributes, comment};
    }

    fieldRow = fieldMatcher.exec(fields);
  }

  return false;
};

export default getFieldLine;
