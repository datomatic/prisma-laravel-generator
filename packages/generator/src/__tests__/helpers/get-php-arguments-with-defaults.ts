import getPhpArgumentsWithDefaults from '../../helpers/get-php-arguments-with-defaults';

test('getPhpArgumentsWithDefaults: one defined argument', () => {
  expect(getPhpArgumentsWithDefaults(['test'], 'null')).toBe('test');
});

test('getPhpArgumentsWithDefaults: multiple defined arguments', () => {
  expect(getPhpArgumentsWithDefaults(['test', 'second', '100'], 'null')).toBe(
    'test, second, 100',
  );
});

test('getPhpArgumentsWithDefaults: one undefined argument', () => {
  expect(getPhpArgumentsWithDefaults([undefined], 'null')).toBe('');
});

test('getPhpArgumentsWithDefaults: multiple undefined arguments', () => {
  expect(
    getPhpArgumentsWithDefaults([undefined, undefined, undefined], 'null'),
  ).toBe('');
});

test('getPhpArgumentsWithDefaults: one undefined argument after defined argument', () => {
  expect(getPhpArgumentsWithDefaults(['test', undefined], 'null')).toBe('test');
});

test('getPhpArgumentsWithDefaults: one undefined argument before defined argument', () => {
  expect(getPhpArgumentsWithDefaults([undefined, 'test'], 'null')).toBe(
    'null, test',
  );
});

test('getPhpArgumentsWithDefaults: multiple undefined argument after defined argument', () => {
  expect(
    getPhpArgumentsWithDefaults(['test', 'test', undefined, undefined], 'null'),
  ).toBe('test, test');
});

test('getPhpArgumentsWithDefaults: multiple undefined argument before defined argument', () => {
  expect(
    getPhpArgumentsWithDefaults([undefined, undefined, 'test', 'test'], 'null'),
  ).toBe('null, null, test, test');
});

test('getPhpArgumentsWithDefaults: mixed undefined arguments', () => {
  expect(
    getPhpArgumentsWithDefaults(
      [undefined, 'first', 'second', undefined, 'third', undefined, undefined],
      'null',
    ),
  ).toBe('null, first, second, null, third');
});

test('getPhpArgumentsWithDefaults: array defaults', () => {
  expect(
    getPhpArgumentsWithDefaults(
      [undefined, 'first', 'second', undefined, 'third', undefined, undefined],
      ['null', 'null', 'null', 'undefined', 'null', 'undefined', '0'],
    ),
  ).toBe('null, first, second, undefined, third');
});

test('getPhpArgumentsWithDefaults: array defaults with wrong length', () => {
  expect(() =>
    getPhpArgumentsWithDefaults(
      [undefined, 'first', 'second', undefined, 'third', undefined, undefined],
      ['null', 'null', 'null'],
    ),
  ).toThrow(Error);
});
