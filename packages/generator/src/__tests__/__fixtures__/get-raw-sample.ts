import {join} from 'node:path';
import {readFile} from 'node:fs/promises';

export const getRawSample = async () => {
  const buffer = await readFile(join(__dirname, './sample.prisma'));
  return buffer.toString();
};

export default {getRawSample};
