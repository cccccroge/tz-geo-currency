const stylistic = require('@stylistic/eslint-plugin');

const customized = stylistic.configs.customize({
  // the following options are the default values
  indent: 2,
  quotes: 'single',
  semi: false,
});

module.exports = {
  "env": {
    "es6": true,
    "browser": true,
    "jest": true,
  },
  "extends": ["eslint:recommended"],
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "ignorePatterns": ['.eslintrc.js', "script/", "src/data/", "dist/", "babel.config.js"],
  "plugins": ["@stylistic"],
  "rules": {
    ...customized.rules,
  }
};
