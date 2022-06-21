import _ from 'lodash';

const sanitize = (s: string) => _.chain(s).toLower().trim().value();

const findOnDocumentation = (
  find: string,
  documentation?: string | undefined,
): boolean => {
  if (!documentation) {
    return false;
  }
  const sanitizedFind = sanitize(find);
  return _.chain(documentation)
    .replace('\n', ',')
    .split(',')
    .some(d => sanitize(d) === sanitizedFind)
    .value();
};

export default findOnDocumentation;
