// Inspired by:
// https://github.com/iiian/prisma-generator-entityframework/blob/master/packages/generator/src/helpers/rawSchema/getMappedFieldLine.ts

const modelRegexp = (modelName: string) =>
  new RegExp(`(\\s+|^)model\\s+${modelName}\\s*\\{([^}]*)}`, 'gm');
const commentsMatcher = /(?<!\/)\/\/[^\n/]+/gm;
const modelAttributesMatcher = /@@\S+/gm;
const fieldMatcher =
  /(\/{3} *([^\n]*)\n\s*)?([^\s/]+)\s+([^\s/]+)((\s+@[^\n/]+)*)([\t ]*(\/{3}\s*([^\n]*)\s*)?)\s*/gm;

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
      if (fieldRow[9]) {
        if (comment) {
          comment += ` ${fieldRow[9]}`;
        } else {
          comment = fieldRow[9] ?? undefined;
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
