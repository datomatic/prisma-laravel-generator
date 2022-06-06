import prettier from 'prettier/standalone';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import phpPlugin from '@prettier/plugin-php/standalone';

export const prettify = (content: string): string => {
  return prettier.format(content.trim(), {
    plugins: [phpPlugin],
    parser: 'php',
  });
};

export default {prettify};
