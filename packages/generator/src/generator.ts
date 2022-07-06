import {generatorHandler, GeneratorOptions} from '@prisma/generator-helper';
import {logger} from '@prisma/sdk';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import _ from 'lodash';
import {GENERATOR_NAME} from './constants';
import generateEnum from './generators/enums/generator';
import writeFileSafely from './utils/write-file-safely';
import {formatFile} from './utils/php-cs-fixer';

import {version} from '../package.json';
import MultipleDataSourcesError from './errors/multiple-data-sources-error';
import generateModel from './generators/models/generator';

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

    if (options.datasources.length > 1) {
      throw new MultipleDataSourcesError();
    }

    const buffer = await readFile(options.schemaPath);
    const rawSchema = buffer.toString();

    await Promise.all(
      [
        ..._.map(options.dmmf.datamodel.enums, async enumInfo => {
          const generatedEnum = generateEnum(enumInfo);

          const writeLocation = path.join(
            outputPath,
            'app',
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
        ..._.map(options.dmmf.datamodel.models, async model => {
          const generatedModel = generateModel(
            model,
            options.dmmf.datamodel.models,
            options.dmmf.datamodel.enums,
            rawSchema,
            options.datasources[0].provider,
          );

          const writeLocation = path.join(
            outputPath,
            'app',
            'Models',
            'Prisma',
            `${model.name}.php`,
          );
          await writeFileSafely(writeLocation, generatedModel);

          await formatFile(
            writeLocation,
            options.generator.config.phpCsFixerBinPath,
            options.generator.config.phpCsFixerConfigPath,
          );
        }),
      ].flat(),
    );
  },
});
