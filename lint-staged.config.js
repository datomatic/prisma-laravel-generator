module.exports = {
  // Run type-check on changes to TypeScript files
  '**/*.ts?(x)': () => 'yarn workspace prisma-laravel-generator run type-check',
  // Run ESLint on all JavaScript/TypeScript files
  '**/*.(ts|js)?(x)': filenames => [
    `yarn format ${filenames.join(' ')}`,
    `yarn lint ${filenames.join(' ')}`,
  ],
};
