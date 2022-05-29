import {mkdir, writeFile} from 'node:fs/promises';
import path from 'node:path';

const writeFileSafely = async (writeLocation: string, content: string) => {
  await mkdir(path.dirname(writeLocation), {
    recursive: true,
  });

  await writeFile(writeLocation, content ?? '', 'utf8');
};

export default writeFileSafely;
