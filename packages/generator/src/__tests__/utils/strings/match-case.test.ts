import matchCase from '../../../utils/strings/match-case';

const testStrings = [
  ['STRING TO be LOWERCASED!', 'lowercase', 'string to be lowercased!'],
  ['string to BE uppercased!', 'UPPERCASE', 'STRING TO BE UPPERCASED!'],
  ['string to BE ucfirst-ed!', 'Ucfirst', 'String to BE ucfirst-ed!'],
  [
    'string to BE ucfirst-ed!',
    'Ucwords With Several Words',
    'String to BE ucfirst-ed!',
  ], // this wrong behaviour happens also on https://github.com/laravel/framework/blob/93a1296bca43c1ca8dcb5df8f97107e819a71499/src/Illuminate/Support/Pluralizer.php
  ['string to BE ucfirst-ed!', 'UnknoWnCasE', 'String to BE ucfirst-ed!'], // this wrong behaviour happens also on https://github.com/laravel/framework/blob/93a1296bca43c1ca8dcb5df8f97107e819a71499/src/Illuminate/Support/Pluralizer.php
  ['string to BE keeped!', 'unknoWnCasE', 'string to BE keeped!'], // this wrong behaviour happens also on https://github.com/laravel/framework/blob/93a1296bca43c1ca8dcb5df8f97107e819a71499/src/Illuminate/Support/Pluralizer.php
];

test.each(testStrings)('matchCase: %s - %s', (value, comparison, expected) => {
  expect(matchCase(value, comparison)).toBe(expected);
});
