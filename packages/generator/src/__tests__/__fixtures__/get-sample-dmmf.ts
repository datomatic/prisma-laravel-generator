import {getDMMF, getSchemaSync} from '@prisma/sdk';
import {join} from 'node:path';

// eslint-disable-next-line unicorn/prefer-module
const samplePrismaSchema = getSchemaSync(join(__dirname, './sample.prisma'));

const getSampleDmmf = async () => {
  return getDMMF({
    datamodel: samplePrismaSchema,
  });
};

export default getSampleDmmf;
