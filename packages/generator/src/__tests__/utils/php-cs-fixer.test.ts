import {mkdtemp, readFile, rm, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import os from 'node:os';
import {existsSync} from 'node:fs';
import {checkPhpCsFixer, format, formatFile} from '../../utils/php-cs-fixer';

test('checkPhpCsFixer: with valid paths', () => {
  expect(
    checkPhpCsFixer(
      './../../tools/php-cs-fixer/vendor/bin/php-cs-fixer',
      './../../tools/php-cs-fixer/.php-cs.dist.php',
    ),
  ).toBeTruthy();
});

test('checkPhpCsFixer: with invalid bin', () => {
  expect(() =>
    checkPhpCsFixer(
      './php-cs-fixer',
      './../../tools/php-cs-fixer/.php-cs.dist.php',
    ),
  ).toThrowError();
});

test('checkPhpCsFixer: with invalid config', () => {
  expect(() =>
    checkPhpCsFixer(
      './../../tools/php-cs-fixer/vendor/bin/php-cs-fixer',
      './.php-cs.dist.php',
    ),
  ).toThrowError();
});

test('checkPhpCsFixer: with invalid bin and config', () => {
  expect(() =>
    checkPhpCsFixer('./php-cs-fixer', './.php-cs.dist.php'),
  ).toThrowError();
});

describe('formatFile: temporary folder setup', () => {
  let temporaryPath = '';

  beforeAll(async () => {
    temporaryPath = await mkdtemp(
      join(os.tmpdir(), 'prisma-laravel-generator-'),
    );
  });

  test('formatFile: default bin', async () => {
    const path = join(temporaryPath, 'test_default_bin.php');
    expect(existsSync(path)).toBeFalsy();

    await writeFile(
      path,
      '<?php namespace App\\Enums\\Prisma; enum Test { case A = "A"; case B = \'B\'; case C; }',
      'utf8',
    );
    expect(existsSync(path)).toBeTruthy();

    await expect(async () => {
      await formatFile(path);
    }).rejects.toThrowError();
  });

  test('formatFile: format php file', async () => {
    const path = join(temporaryPath, 'test_valid.php');
    expect(existsSync(path)).toBeFalsy();

    await writeFile(
      path,
      '<?php namespace App\\Enums\\Prisma; enum Test { case A = "A"; case B = \'B\'; case C; }',
      'utf8',
    );
    expect(existsSync(path)).toBeTruthy();

    await formatFile(
      path,
      './../../tools/php-cs-fixer/vendor/bin/php-cs-fixer',
      './../../tools/php-cs-fixer/.php-cs.dist.php',
    );
    expect(existsSync(path)).toBeTruthy();

    expect(await readFile(path, {encoding: 'utf8'})).toMatchSnapshot(
      'prettified',
    );
  });

  test('formatFile: format empty file', async () => {
    const path = join(temporaryPath, 'test_empty.php');
    expect(existsSync(path)).toBeFalsy();

    await writeFile(path, '', 'utf8');
    expect(existsSync(path)).toBeTruthy();

    await formatFile(
      path,
      './../../tools/php-cs-fixer/vendor/bin/php-cs-fixer',
      './../../tools/php-cs-fixer/.php-cs.dist.php',
    );
    expect(existsSync(path)).toBeTruthy();

    expect(await readFile(path, {encoding: 'utf8'})).toMatchSnapshot(
      'prettified',
    );
  });

  test('formatFile: not existing file', async () => {
    await expect(async () =>
      formatFile(
        './test.php',
        './../../tools/php-cs-fixer/vendor/bin/php-cs-fixer',
        './../../tools/php-cs-fixer/.php-cs.dist.php',
      ),
    ).rejects.toThrowError();
  });

  afterAll(async () => {
    if (temporaryPath) {
      try {
        await rm(temporaryPath, {recursive: true, force: true});
      } catch {
        // ignore
      }
    }
  });
});

test('format: valid content', async () => {
  const prettified = await format(
    '<?php namespace App\\Enums\\Prisma; enum Test { case A = "A"; case B = \'B\'; case C; }',
    './../../tools/php-cs-fixer/vendor/bin/php-cs-fixer',
    './../../tools/php-cs-fixer/.php-cs.dist.php',
  );
  expect(prettified).toMatchSnapshot('prettified');
});

test('format: empty content', async () => {
  const prettified = await format(
    '',
    './../../tools/php-cs-fixer/vendor/bin/php-cs-fixer',
    './../../tools/php-cs-fixer/.php-cs.dist.php',
  );
  expect(prettified).toMatchSnapshot('prettified');
});

test('format: default bin', async () => {
  await expect(async () => {
    await format(
      '<?php namespace App\\Enums\\Prisma; enum Test { case A = "A"; case B = \'B\'; case C; }',
    );
  }).rejects.toThrowError();
});
