import {unlink, readdir} from 'node:fs/promises';
import {join} from 'node:path';
import _ from 'lodash';

const deleteAllFilesInDirectory = async (path: string) => {
  const files = await readdir(path);

  await Promise.allSettled(_.map(files, file => unlink(join(path, file))));
};

export default deleteAllFilesInDirectory;
