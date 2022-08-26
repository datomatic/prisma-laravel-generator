import {generatorHandler, GeneratorOptions} from '@prisma/generator-helper';
import {logger} from '@prisma/sdk';
import path from 'node:path';
import {readFile} from 'node:fs/promises';
import _ from 'lodash';
import {existsSync} from 'node:fs';
import generateEnum from './generators/enums/generator';
import writeFileSafely from './utils/write-file-safely';
import {formatFile} from './utils/php-cs-fixer';

import {version} from '../package.json';
import MultipleDataSourcesError from './errors/multiple-data-sources-error';
import generatePrismaModel from './generators/prisma-models/generator';
import generateModel from './generators/models/generator';
import getModelClassName from './helpers/get-model-classname';
import deleteAllFilesInDirectory from './helpers/delete-all-files-in-directory';
import getModelPath from './helpers/get-model-path';

const GENERATOR_NAME = 'prisma-laravel-generator';

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
    const outputPath = options.generator.output?.value ?? '../';

    const config = {
      prismaModelsPath: './app/Models/Prisma',
      prismaModelsPrefix: 'Prisma',
      modelsPath: './app/Models',
      prismaEnumsPath: './app/Enums/Prisma',
      baseModel: 'Illuminate\\Database\\Eloquent\\Model',
      basePivotModel: 'Illuminate\\Database\\Eloquent\\Relations\\Pivot',
      explicitTableNamesOnRelations: true,
      phpCsFixerBinPath: undefined,
      phpCsFixerConfigPath: undefined,
      ...options.generator.config,
    };

    if (options.datasources.length > 1) {
      throw new MultipleDataSourcesError();
    }

    const buffer = await readFile(options.schemaPath);
    const rawSchema = buffer.toString();

    await Promise.all([
      deleteAllFilesInDirectory(path.join(outputPath, config.prismaEnumsPath)),
      deleteAllFilesInDirectory(path.join(outputPath, config.prismaModelsPath)),
    ]);

    await Promise.all(
      [
        ..._.map(options.dmmf.datamodel.enums, async enumInfo => {
          const generatedEnum = generateEnum(enumInfo);

          const customPath = getModelPath(enumInfo);

          const writeLocation = path.join(
            outputPath,
            customPath ?? config.prismaEnumsPath,
            `${enumInfo.name}.php`,
          );

          await writeFileSafely(writeLocation, generatedEnum);

          if (config.phpCsFixerBinPath && config.phpCsFixerConfigPath) {
            await formatFile(
              writeLocation,
              config.phpCsFixerBinPath,
              config.phpCsFixerConfigPath,
            );
          }
        }),
        ..._.map(options.dmmf.datamodel.models, async model => {
          const generatedPrismaModel = generatePrismaModel(
            model,
            options.dmmf.datamodel.models,
            options.dmmf.datamodel.enums,
            rawSchema,
            options.datasources[0].provider,
            config.baseModel,
            config.basePivotModel,
            config.prismaModelsPrefix,
            config.explicitTableNamesOnRelations,
          );

          const writeLocation = path.join(
            outputPath,
            config.prismaModelsPath,
            `${getModelClassName(model, config.prismaModelsPrefix)}.php`,
          );
          await writeFileSafely(writeLocation, generatedPrismaModel);

          if (config.phpCsFixerBinPath && config.phpCsFixerConfigPath) {
            await formatFile(
              writeLocation,
              config.phpCsFixerBinPath,
              config.phpCsFixerConfigPath,
            );
          }
        }),
        ..._.map(options.dmmf.datamodel.models, async model => {
          const generatedModel = generateModel(
            model,
            config.prismaModelsPrefix,
          );

          const customPath = getModelPath(model);

          const writeLocation = path.join(
            outputPath,
            customPath ?? config.modelsPath,
            `${getModelClassName(model)}.php`,
          );

          if (!existsSync(writeLocation)) {
            await writeFileSafely(writeLocation, generatedModel);

            if (config.phpCsFixerBinPath && config.phpCsFixerConfigPath) {
              await formatFile(
                writeLocation,
                config.phpCsFixerBinPath,
                config.phpCsFixerConfigPath,
              );
            }
          }
        }),
      ].flat(),
    );
  },
});
