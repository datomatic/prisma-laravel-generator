import {isEmpty} from 'lodash';
import getFromDocumentation from './get-from-documentation';

const findOnDocumentation = (
  find: string | RegExp,
  documentation?: string | undefined,
): boolean => {
  return !isEmpty(getFromDocumentation(find, documentation));
};

export default findOnDocumentation;
