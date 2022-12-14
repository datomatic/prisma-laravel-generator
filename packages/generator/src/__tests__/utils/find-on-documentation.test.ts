import findOnDocumentation from '../../utils/find-on-documentation';

test('findOnDocumentation: undefined', () => {
  expect(findOnDocumentation('read-only')).toBe(false);
});

test('findOnDocumentation: empty', () => {
  expect(findOnDocumentation('read-only', '')).toBe(false);
});

test('findOnDocumentation: single not present', () => {
  expect(findOnDocumentation('read-only', 'doc')).toBe(false);
});

test('findOnDocumentation: multiple not present', () => {
  expect(findOnDocumentation('read-only', 'some, other, doc')).toBe(false);
});

test('findOnDocumentation: single present', () => {
  expect(findOnDocumentation('read-only', 'read-only')).toBe(true);
});

test('findOnDocumentation: multiple present', () => {
  expect(findOnDocumentation('read-only', 'some, read-only, other')).toBe(true);
});

test('findOnDocumentation: case insensitivity', () => {
  expect(findOnDocumentation('read-only', 'some, Read-OnLy, doc')).toBe(true);
});

test('findOnDocumentation: single with spaces', () => {
  expect(findOnDocumentation('read-only', '    read-only   ')).toBe(true);
});

test('findOnDocumentation: multiple with spaces', () => {
  expect(
    findOnDocumentation('read-only', '   some   ,    read-only   , doc   '),
  ).toBe(true);
});

test('findOnDocumentation: regexp, undefined', () => {
  expect(findOnDocumentation(/read-[a-z]+/g)).toBe(false);
});

test('findOnDocumentation: regexp empty', () => {
  expect(findOnDocumentation(/read-[a-z]+/g, '')).toBe(false);
});

test('findOnDocumentation: regexp single not present', () => {
  expect(findOnDocumentation(/read-[a-z]+/g, 'doc')).toBe(false);
});

test('findOnDocumentation: regexp multiple not present', () => {
  expect(findOnDocumentation(/read-[a-z]+/g, 'some, other, doc')).toBe(false);
});

test('findOnDocumentation: regexp single present', () => {
  expect(findOnDocumentation(/read-[a-z]+/g, 'read-only')).toBe(true);
});

test('findOnDocumentation: regexp multiple present', () => {
  expect(findOnDocumentation(/read-[a-z]+/g, 'some, read-only, other')).toBe(
    true,
  );
});

test('findOnDocumentation: regexp case insensitivity', () => {
  expect(findOnDocumentation(/read-[a-z]+/g, 'some, Read-OnLy, doc')).toBe(
    true,
  );
});

test('findOnDocumentation: regexp single with spaces', () => {
  expect(findOnDocumentation(/read-[a-z]+/g, '    read-only   ')).toBe(true);
});

test('findOnDocumentation: regexp multiple with spaces', () => {
  expect(
    findOnDocumentation(/read-[a-z]+/g, '   some   ,    read-only   , doc   '),
  ).toBe(true);
});
