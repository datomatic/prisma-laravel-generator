import _, {isString, trim} from 'lodash';

const sanitize = (s: string) => _.chain(s).toLower().trim().value();

const getFromDocumentation = (
  find: string | RegExp,
  documentation?: string | undefined,
): string[] => {
  if (!documentation) {
    return [];
  }
  const sanitizedFind = isString(find) ? sanitize(find) : find;
  return _.chain(documentation)
    .replace(/\n/g, ',')
    .split(',')
    .map(d => trim(d))
    .filter(d =>
      isString(sanitizedFind)
        ? sanitize(d) === sanitizedFind
        : sanitize(d).match(sanitizedFind) !== null,
    )
    .value();
};

export default getFromDocumentation;
