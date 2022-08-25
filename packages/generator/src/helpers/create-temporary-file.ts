import {mkdtemp, writeFile} from 'node:fs/promises';
import os from 'node:os';
import {join} from 'node:path';

const createTemporaryFile = async (data = '', filename = 'temp_file') => {
  const temporaryPath = await mkdtemp(
    join(os.tmpdir(), 'prisma-laravel-generator-'),
  );

  const filePath = join(temporaryPath, filename);
  await writeFile(filePath, data, 'utf8');

  return filePath;
};

export default createTemporaryFile;
