const rules = {
  // some libs use any...
  // "@typescript-eslint/no-unsafe-assignment": "off",
  // '@typescript-eslint/no-unsafe-call': 'off',
  // "@typescript-eslint/no-unsafe-member-access": "off",
  // "@typescript-eslint/no-unsafe-return": "off",
  // '@typescript-eslint/no-unsafe-argument': 'off',

  // allow for(... of ...), we're not in browser
  'no-restricted-syntax': 'off',

  // allow __dirname
  'unicorn/prefer-module': 'off',

  // sometimes reduce can be useful
  'unicorn/no-array-reduce': 'off',
};

module.exports = {
  root: true,
  env: {
    'jest/globals': true,
  },
  parserOptions: {
    sourceType: 'module',
    project: ['./tsconfig.json', './packages/generator/tsconfig.json'],
  },
  settings: {
    'import/extensions': ['.js', '.ts'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: './tsconfig.json',
      },
    },
  },
  plugins: [
    '@typescript-eslint',
    'workspaces',
    'import',
    'eslint-comments',
    'jest',
    'promise',
    'unicorn',
    'prettier',
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'airbnb-base',
    'plugin:workspaces/recommended',
    'plugin:eslint-comments/recommended',
    'plugin:jest/recommended',
    'plugin:promise/recommended',
    'plugin:unicorn/recommended',
    'plugin:prettier/recommended',
  ],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:import/recommended',
        'airbnb-base',
        'airbnb-typescript/base', // Typescript-specific
        'plugin:@typescript-eslint/recommended', // Typescript-specific
        'plugin:@typescript-eslint/recommended-requiring-type-checking', // Typescript-specific
        'plugin:workspaces/recommended',
        'plugin:eslint-comments/recommended',
        'plugin:jest/recommended',
        'plugin:promise/recommended',
        'plugin:unicorn/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        ...rules,
      },
    },
    {
      files: ['*.js'],
      rules: {
        ...rules,
        // Allow CJS
        '@typescript-eslint/no-var-requires': 'off',
        'unicorn/prefer-module': 'off',
        'global-require': 'off',
      },
    },
  ],
};
