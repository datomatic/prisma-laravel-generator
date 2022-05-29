import {generatorHandler, GeneratorOptions} from '@prisma/generator-helper';
import {logger} from '@prisma/sdk';
import path from 'node:path';
import {GENERATOR_NAME} from './constants';
import generateEnum from './generators/enums/generator';
import writeFileSafely from './utils/write-file-safely';
import {formatFile} from './utils/php-cs-fixer';

import {version} from '../package.json';

generatorHandler({
  onManifest() {
    logger.info(`${GENERATOR_NAME}:Registered`);
    return {
      version,
      defaultOutput: '../generated',
      prettyName: GENERATOR_NAME,
    };
  },
  onGenerate: async (options: GeneratorOptions) => {
    const outputPath = options.generator.output?.value ?? '../generated';

    await Promise.all(
      options.dmmf.datamodel.enums.map(async enumInfo => {
        const generatedEnum = generateEnum(enumInfo);

        const writeLocation = path.join(
          outputPath,
          'Enums',
          'Prisma',
          `${enumInfo.name}.php`,
        );
        await writeFileSafely(writeLocation, generatedEnum);

        await formatFile(
          writeLocation,
          options.generator.config.phpCsFixerBinPath,
          options.generator.config.phpCsFixerConfigPath,
        );
      }),
    );
  },
});
