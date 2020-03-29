module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
    mocha: true
  },
  parser: 'babel-eslint',
  plugins: ['react'],
  extends: ['eslint:recommended'],
  rules: {
    'array-callback-return': 2,
    camelcase: [2, { properties: 'always' }],
    'linebreak-style': [2, 'unix'],
    'no-cond-assign': [2, 'always'],
    'no-console': 2,
    'no-global-assign': 2,
    'no-restricted-properties': [
      2,
      {
        object: 'describe',
        property: 'only',
        message: 'Please run all tests!'
      },
      {
        object: 'describe',
        property: 'skip',
        message: 'Please run all tests!'
      },
      {
        object: 'it',
        property: 'only',
        message: 'Please run all tests!'
      },
      {
        object: 'it',
        property: 'skip',
        message: 'Please run all tests!'
      }
    ],
    'no-template-curly-in-string': 2,
    'no-unused-vars': 2,
    'padding-line-between-statements': [
      'error',
      { blankLine: 'always', prev: ['const', 'let', 'var'], next: '*' },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var']
      }
    ],
    'prefer-destructuring': [2, { array: false, object: true }],
    'prefer-rest-params': 2,

    'react/display-name': 0,
    'react/forbid-prop-types': 0,
    'react/no-comment-textnodes': 0,
    'react/no-danger': 2,
    'react/no-danger-with-children': 2,
    'react/no-deprecated': 2,
    'react/no-did-mount-set-state': 2,
    'react/no-did-update-set-state': 2,
    'react/no-direct-mutation-state': 2,
    'react/no-find-dom-node': 2,
    'react/no-is-mounted': 2,
    'react/no-multi-comp': [2, { ignoreStateless: true }],
    'react/no-render-return-value': 2,
    'react/no-set-state': 0,
    'react/no-string-refs': 2,
    'react/no-unknown-property': 2,
    'react/no-unused-prop-types': 0, // https://github.com/yannickcr/eslint-plugin-react/issues/944
    'react/prefer-es6-class': [2, 'always'],
    'react/prefer-stateless-function': 2,
    'react/prop-types': [2, { skipUndeclared: true }],
    'react/react-in-jsx-scope': 2,
    'react/require-optimization': 0,
    'react/require-render-return': 2,
    'react/self-closing-comp': 2,
    'react/sort-comp': 2,
    'react/sort-prop-types': 0,
    'react/style-prop-object': 2,

    'react/jsx-boolean-value': [2, 'always'],
    'react/jsx-filename-extension': [2, { extensions: ['.js'] }],
    'react/jsx-handler-names': 0,
    'react/jsx-key': 2,
    'react/jsx-max-props-per-line': 0,
    'react/jsx-no-bind': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-literals': 0,
    'react/jsx-no-target-blank': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-pascal-case': 2,
    'react/jsx-sort-props': 0,
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2
  }
};
