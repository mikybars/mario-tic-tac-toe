module.exports = {
  root: true,
  env: {
    browser: true,
    es2020: true,
    jest: true,
    mocha: true,
    'vitest-globals/env': true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:vitest-globals/recommended',
    'standard',
    'standard-jsx'
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    // propTypes is deprecated and jumping to TS seems daunting
    // https://react.dev/blog/2024/04/25/react-19-upgrade-guide#removed-proptypes-and-defaultprops
    'react/prop-types': 0,
    'react/jsx-no-target-blank': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true }
    ],
    'space-before-function-paren': ['error', 'never']
  }
}
