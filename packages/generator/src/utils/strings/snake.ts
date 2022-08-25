import ucwords from './ucwords';

// see https://github.com/laravel/framework/blob/93a1296bca43c1ca8dcb5df8f97107e819a71499/src/Illuminate/Support/Str.php

const snake = (value: string, delimiter = '_') => {
  if (/^[a-z]*$/g.test(value)) {
    return value;
  }

  return ucwords(value)
    .replaceAll(/\s+/g, '')
    .replaceAll(/(.)(?=[A-Z])/g, `$1${delimiter}`)
    .toLowerCase();
};

export default snake;
