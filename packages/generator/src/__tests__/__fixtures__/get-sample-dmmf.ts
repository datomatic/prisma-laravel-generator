import {getDMMF, getSchemaSync} from '@prisma/sdk';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';

const samplePrismaSchema = getSchemaSync(
  join(dirname(fileURLToPath(import.meta.url)), './sample.prisma'),
);

const getSampleDmmf = async () => {
  return getDMMF({
    datamodel: samplePrismaSchema,
  });
};

export default getSampleDmmf;
