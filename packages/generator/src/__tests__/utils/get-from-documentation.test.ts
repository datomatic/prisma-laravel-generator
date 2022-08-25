import getFromDocumentation from '../../utils/get-from-documentation';

test('getFromDocumentation: undefined', () => {
  expect(getFromDocumentation('read-only')).toEqual([]);
});

test('getFromDocumentation: empty', () => {
  expect(getFromDocumentation('read-only', '')).toEqual([]);
});

test('getFromDocumentation: single not present', () => {
  expect(getFromDocumentation('read-only', 'doc')).toEqual([]);
});

test('getFromDocumentation: multiple not present', () => {
  expect(getFromDocumentation('read-only', 'some, other, doc')).toEqual([]);
});

test('getFromDocumentation: single present', () => {
  expect(getFromDocumentation('read-only', 'read-only')).toEqual(['read-only']);
});

test('getFromDocumentation: multiple present', () => {
  expect(getFromDocumentation('read-only', 'some, read-only, other')).toEqual([
    'read-only',
  ]);
});

test('getFromDocumentation: case insensitivity', () => {
  expect(getFromDocumentation('read-only', 'some, Read-OnLy, doc')).toEqual([
    'Read-OnLy',
  ]);
});

test('getFromDocumentation: single with spaces', () => {
  expect(getFromDocumentation('read-only', '    read-only   ')).toEqual([
    'read-only',
  ]);
});

test('getFromDocumentation: multiple with spaces', () => {
  expect(
    getFromDocumentation('read-only', '   some   ,    read-only   , doc   '),
  ).toEqual(['read-only']);
});

test('getFromDocumentation: regexp, undefined', () => {
  expect(getFromDocumentation(/read-[a-z]+/g)).toEqual([]);
});

test('getFromDocumentation: regexp empty', () => {
  expect(getFromDocumentation(/read-[a-z]+/g, '')).toEqual([]);
});

test('getFromDocumentation: regexp single not present', () => {
  expect(getFromDocumentation(/read-[a-z]+/g, 'doc')).toEqual([]);
});

test('getFromDocumentation: regexp multiple not present', () => {
  expect(getFromDocumentation(/read-[a-z]+/g, 'some, other, doc')).toEqual([]);
});

test('getFromDocumentation: regexp single present', () => {
  expect(getFromDocumentation(/read-[a-z]+/g, 'read-only')).toEqual([
    'read-only',
  ]);
});

test('getFromDocumentation: regexp multiple present', () => {
  expect(
    getFromDocumentation(/read-[a-z]+/g, 'some, read-only, other'),
  ).toEqual(['read-only']);
});

test('getFromDocumentation: regexp case insensitivity', () => {
  expect(getFromDocumentation(/read-[a-z]+/gi, 'some, Read-OnLy, doc')).toEqual(
    ['Read-OnLy'],
  );
});

test('getFromDocumentation: regexp single with spaces', () => {
  expect(getFromDocumentation(/read-[a-z]+/g, '    read-only   ')).toEqual([
    'read-only',
  ]);
});

test('getFromDocumentation: regexp multiple with spaces', () => {
  expect(
    getFromDocumentation(/read-[a-z]+/g, '   some   ,    read-only   , doc   '),
  ).toEqual(['read-only']);
});
