module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    'max-len': ['warn', { code: 140, ignoreComments: true }],
    'react/react-in-jsx-scope': 'off',
    'react/no-unknown-property': [0, { ignore: ['css', 'jsx'] }],
  },
};
