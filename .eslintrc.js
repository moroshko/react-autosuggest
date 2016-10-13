module.exports = {
  env: {
    es6: true,
    node: true,
    browser: true,
    mocha: true
  },
  parser: 'babel-eslint',
  plugins: [
    'react'
  ],
  extends: [
    'eslint:recommended'
  ],
  rules: {
    'array-callback-return': 2,
    'brace-style': [2, '1tbs'],
    'camelcase': [2, { 'properties': 'always' }],
    'comma-dangle': [2, 'never'],
    'comma-style': [2, 'last'],
    'eol-last': 2,
    'func-call-spacing': 2,
    'indent': [2, 2, { 'SwitchCase': 1 }],
    'key-spacing': [2, { 'beforeColon': false, 'afterColon': true }],
    'keyword-spacing': 2,
    'linebreak-style': [2, 'unix'],
    'no-cond-assign': [2, 'always'],
    'no-console': 2,
    'no-global-assign': 2,
    'no-multiple-empty-lines': [2, { 'max': 1 }],
    'no-restricted-properties': [2,
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
    'no-trailing-spaces': 2,
    'no-unused-vars': 2,
    'no-whitespace-before-property': 2,
    'newline-after-var': [2, 'always'],
    'object-curly-spacing': [2, 'always'],
    'prefer-rest-params': 2,
    'quote-props': [2, 'as-needed'],
    'quotes': [2, 'single'],
    'semi': [2, 'always'],
    'space-before-blocks': [2, 'always'],
    'space-before-function-paren': [2, 'never'],
    'space-in-parens': [2, 'never'],
    'template-curly-spacing': [2, 'never'],

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
    'react/no-multi-comp': [2, { 'ignoreStateless': true }],
    'react/no-render-return-value': 2,
    'react/no-set-state': 0,
    'react/no-string-refs': 2,
    'react/no-unknown-property': 2,
    'react/no-unused-prop-types': 0, // https://github.com/yannickcr/eslint-plugin-react/pull/835
    'react/prefer-es6-class': [2, 'always'],
    'react/prefer-stateless-function': 2,
    'react/prop-types': 2,
    'react/react-in-jsx-scope': 2,
    'react/require-optimization': 0,
    'react/require-render-return': 2,
    'react/self-closing-comp': 2,
    'react/sort-comp': 2,
    'react/sort-prop-types': 0,
    'react/style-prop-object': 2,

    'react/jsx-boolean-value': [2, 'always'],
    'react/jsx-closing-bracket-location': [2, 'tag-aligned'],
    'react/jsx-curly-spacing': [2, 'never', { 'allowMultiline': true }],
    'react/jsx-equals-spacing': [2, 'never'],
    'react/jsx-filename-extension': [2, { 'extensions': ['.js'] }],
    'react/jsx-first-prop-new-line': [2, 'multiline'],
    'react/jsx-handler-names': 0,
    'react/jsx-indent': [2, 2],
    'react/jsx-indent-props': [2, 2],
    'react/jsx-key': 2,
    'react/jsx-max-props-per-line': 0,
    'react/jsx-no-bind': 2,
    'react/jsx-no-duplicate-props': 2,
    'react/jsx-no-literals': 0,
    'react/jsx-no-target-blank': 2,
    'react/jsx-no-undef': 2,
    'react/jsx-pascal-case': 2,
    'react/jsx-sort-props': 0,
    'react/jsx-space-before-closing': [2, 'always'],
    'react/jsx-uses-react': 2,
    'react/jsx-uses-vars': 2,
    'react/jsx-wrap-multilines': 2
  }
};
