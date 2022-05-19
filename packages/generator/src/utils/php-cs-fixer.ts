import {exec} from 'node:child_process';
import {relative} from 'node:path';
import {logger} from '@prisma/sdk';
import {existsSync} from 'node:fs';

const formatFile = (
  path: string,
  phpCsFixerBin = './tools/php-cs-fixer/vendor/bin/php-cs-fixer',
  phpCsFixerConfig = './tools/php-cs-fixer/.php-cs.dist.php',
): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!existsSync(path)) {
      reject(
        new Error(
          `The requested file to be prettified does not exists: ${path}`,
        ),
      );
      return;
    }
    if (!existsSync(phpCsFixerBin)) {
      reject(
        new Error(
          `The provided path for php-cs-fixer does not exists: ${phpCsFixerBin}`,
        ),
      );
      return;
    }
    if (!existsSync(phpCsFixerConfig)) {
      reject(
        new Error(
          `The provided path for php-cs-fixer's config does not exists: ${phpCsFixerConfig}`,
        ),
      );
      return;
    }

    logger.info(`Prettifying ./${relative(process.cwd(), path)} ...`);
    exec(
      `${phpCsFixerBin} fix ${path} --quiet --config=${phpCsFixerConfig}`,
      error => {
        if (error) {
          reject(error);
          return;
        }
        resolve();
      },
    );
  });
};

export default formatFile;
