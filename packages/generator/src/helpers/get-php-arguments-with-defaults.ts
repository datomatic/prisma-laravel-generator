import _ from 'lodash';

const getPhpArgumentsWithDefaults = (
  conditionalArguments: (string | undefined)[],
  defaults: string | string[],
) => {
  if (_.isArray(defaults) && defaults.length !== conditionalArguments.length) {
    throw new Error(
      'If defaults are provided as array, there should be exactly one default value defined for each conditional argument (the two arrays passed as argument must have the same length).',
    );
  }

  let toBeRemoved = 0;
  const resultingArguments = [];
  for (const [index, conditionalArgument] of conditionalArguments.entries()) {
    if (_.isEmpty(conditionalArgument)) {
      resultingArguments.push(_.isArray(defaults) ? defaults[index] : defaults);
      toBeRemoved += 1;
    } else {
      resultingArguments.push(conditionalArgument);
      toBeRemoved = 0;
    }
  }

  return _.chain(resultingArguments)
    .slice(0, toBeRemoved > 0 ? -toBeRemoved : undefined)
    .join(', ')
    .value();
};

export default getPhpArgumentsWithDefaults;
