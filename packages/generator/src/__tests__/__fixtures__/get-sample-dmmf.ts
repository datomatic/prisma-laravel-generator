import {getDMMF, getSchemaSync} from '@prisma/sdk';
import {join} from 'node:path';

// eslint-disable-next-line unicorn/prefer-module
const samplePrismaSchema = getSchemaSync(
  join(process.cwd(), 'src/__tests__/__fixtures__/sample.prisma'),
);

const getSampleDmmf = async () => {
  return getDMMF({
    datamodel: samplePrismaSchema,
  });
};

export default getSampleDmmf;
