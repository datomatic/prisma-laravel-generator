import {exec as execPromise} from 'node:child_process';
import {dirname} from 'node:path';
import {existsSync} from 'node:fs';
import {readFile, rm} from 'node:fs/promises';
import {promisify} from 'node:util';
import createTemporaryFile from '../helpers/create-temporary-file';

const exec = promisify(execPromise);

export const checkPhpCsFixer = (
  phpCsFixerBin: string,
  phpCsFixerConfig: string,
) => {
  if (!existsSync(phpCsFixerBin)) {
    throw new Error(
      `The provided path for php-cs-fixer does not exists: ${phpCsFixerBin}`,
    );
  }
  if (!existsSync(phpCsFixerConfig)) {
    throw new Error(
      `The provided path for php-cs-fixer's config does not exists: ${phpCsFixerConfig}`,
    );
  }

  return true;
};

export const formatFile = async (
  path: string,
  phpCsFixerBin = './tools/php-cs-fixer/vendor/bin/php-cs-fixer',
  phpCsFixerConfig = './tools/php-cs-fixer/.php-cs.dist.php',
): Promise<void> => {
  if (!existsSync(path)) {
    throw new Error(
      `The requested file to be prettified does not exists: ${path}`,
    );
  }
  checkPhpCsFixer(phpCsFixerBin, phpCsFixerConfig);

  await exec(
    `"${phpCsFixerBin}" fix "${path}" --quiet --config="${phpCsFixerConfig}"`,
  );
};

export const format = async (
  content: string,
  phpCsFixerBin = './tools/php-cs-fixer/vendor/bin/php-cs-fixer',
  phpCsFixerConfig = './tools/php-cs-fixer/.php-cs.dist.php',
): Promise<string> => {
  checkPhpCsFixer(phpCsFixerBin, phpCsFixerConfig);

  const filePath = await createTemporaryFile(content);
  await formatFile(filePath, phpCsFixerBin, phpCsFixerConfig);

  const prettifiedContent = await readFile(filePath, {encoding: 'utf8'});

  await rm(dirname(filePath), {recursive: true, force: true});

  return prettifiedContent;
};

export default {formatFile, format};
