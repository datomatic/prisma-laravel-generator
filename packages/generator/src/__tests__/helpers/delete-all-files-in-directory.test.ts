import {mkdtemp, readdir, writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import os from 'node:os';
import {existsSync} from 'node:fs';
import deleteAllFilesInDirectory from '../../helpers/delete-all-files-in-directory';

test('deleteAllFilesInDirectory: delete files', async () => {
  const temporaryPath = await mkdtemp(
    join(os.tmpdir(), 'prisma-laravel-generator-'),
  );

  await writeFile(join(temporaryPath, '1.txt'), 'hello', 'utf8');
  await writeFile(join(temporaryPath, '2.txt'), 'hello', 'utf8');
  await writeFile(join(temporaryPath, '3.txt'), 'hello', 'utf8');

  let files = await readdir(temporaryPath);
  expect(files.length).toBe(3);

  await deleteAllFilesInDirectory(temporaryPath);
  files = await readdir(temporaryPath);
  expect(files.length).toBe(0);
});

test('deleteAllFilesInDirectory: invalid directory', async () => {
  const invalidPath = join(
    await mkdtemp(join(os.tmpdir(), 'prisma-laravel-generator-')),
    'invalid',
  );

  expect(existsSync(invalidPath)).toBe(false);

  await expect(deleteAllFilesInDirectory(invalidPath)).resolves.not.toThrow();
});
