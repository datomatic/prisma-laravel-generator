import {prettify} from '../../utils/prettier';

test('prettify: with invalid php', () => {
  expect(() =>
    prettify(
      '<?php namespace App\\Enums\\Prisma;  This = is some ! invalid PHP code }',
    ),
  ).toThrowError();
});

test('prettify: valid content', () => {
  expect(
    prettify(
      '<?php namespace App\\Enums\\Prisma; enum Test { case A = "A"; case B = \'B\'; case C; }',
    ),
  ).toMatchSnapshot('prettified');
});

test('prettify: empty content', () => {
  expect(prettify('')).toMatchSnapshot('prettified');
});
