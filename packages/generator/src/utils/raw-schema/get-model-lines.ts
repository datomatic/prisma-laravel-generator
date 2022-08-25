const modelRegexp = (modelName: string) =>
  new RegExp(`(\\s+|^)model\\s+${modelName}\\s*\\{([^}]*)}`, 'gm');
const commentsMatcher = /(?<!\/)\/\/[^\n/]+/gm;
const modelAttributesMatcher = /@@\S+/gm;

const getModelLines = (
  modelName: string,
  rawContent: string,
): false | string => {
  const modelSection = modelRegexp(modelName).exec(rawContent);
  if (!modelSection || modelSection.length < 2) {
    return false;
  }

  return `${modelSection[2]
    .trim()
    .replaceAll(modelAttributesMatcher, '')
    .replaceAll(commentsMatcher, '')}`;
};

export default getModelLines;
