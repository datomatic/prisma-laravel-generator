import {mkdtemp, readFile, rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {existsSync} from 'node:fs';
import writeFileSafely from '../../utils/write-file-safely';

describe('writeFileSafely: temporary folder setup', () => {
  let temporaryPath = '';

  beforeAll(async () => {
    temporaryPath = await mkdtemp(join(tmpdir(), 'prisma-laravel-generator-'));
  });

  test('writeFileSafely: expect temporary folder available', () => {
    expect(temporaryPath).toBeTruthy();
  });

  test('writeFileSafely: write on file', async () => {
    const path = join(temporaryPath, 'inner/path/test');
    await writeFileSafely(path, 'Hello!');
    expect(existsSync(path)).toBeTruthy();
    expect(await readFile(path, {encoding: 'utf8'})).toBe('Hello!');
  });

  test('writeFileSafely: write empty file', async () => {
    const path = join(temporaryPath, 'inner/path/test');
    await writeFileSafely(path, '');
    expect(existsSync(path)).toBeTruthy();
    expect(await readFile(path, {encoding: 'utf8'})).toBe('');
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
