import {toLower, toUpper} from 'lodash';
import ucfirst from './ucfirst';
import ucwords from './ucwords';

// see https://github.com/laravel/framework/blob/93a1296bca43c1ca8dcb5df8f97107e819a71499/src/Illuminate/Support/Pluralizer.php

const matchCase = (value: string, comparison: string) => {
  const functions = [toLower, toUpper, ucfirst, ucwords];

  for (const f of functions) {
    if (f(comparison) === comparison) {
      return f(value);
    }
  }

  return value;
};

export default matchCase;
