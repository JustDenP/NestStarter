module.exports = {
  env: {
    browser: false,
    es6: true,
    jest: true,
    node: true,
  },
  extends: ['../../.eslintrc.json'],
  ignorePatterns: ['migrations', 'src/generated'],
  overrides: [],
  parserOptions: {
    createDefaultProgram: false,
    project: './tsconfig.json',
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
};
