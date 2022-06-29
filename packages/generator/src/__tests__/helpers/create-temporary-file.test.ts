import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import createTemporaryFile from '../../helpers/create-temporary-file';

test('createTemporaryFile: create file with content', async () => {
  const path = await createTemporaryFile('hello!', 'temp');
  expect(path).toBeTruthy();
  expect(path).toMatch(/(.*)([/\\])prisma-laravel-generator-\w{6}([/\\])temp$/);
  expect(existsSync(path)).toBeTruthy();
  expect(await readFile(path, {encoding: 'utf8'})).toBe('hello!');
});

test('createTemporaryFile: create file with empty content', async () => {
  const path = await createTemporaryFile('', 'temp');
  expect(path).toBeTruthy();
  expect(path).toMatch(/(.*)([/\\])prisma-laravel-generator-\w{6}([/\\])temp$/);
  expect(existsSync(path)).toBeTruthy();
  expect(await readFile(path, {encoding: 'utf8'})).toBe('');
});

test('createTemporaryFile: default params', async () => {
  const path = await createTemporaryFile();
  expect(path).toBeTruthy();
  expect(path).toMatch(
    /(.*)([/\\])prisma-laravel-generator-\w{6}([/\\])temp_file$/,
  );
  expect(existsSync(path)).toBeTruthy();
  expect(await readFile(path, {encoding: 'utf8'})).toBe('');
});

test('createTemporaryFile: default filename', async () => {
  const path = await createTemporaryFile('hello!');
  expect(path).toBeTruthy();
  expect(path).toMatch(
    /(.*)([/\\])prisma-laravel-generator-\w{6}([/\\])temp_file$/,
  );
  expect(existsSync(path)).toBeTruthy();
  expect(await readFile(path, {encoding: 'utf8'})).toBe('hello!');
});
