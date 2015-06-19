Upgrade Guide
=============

### 1.xx.xx -> 2.xx.xx

- **Breaking:** `inputAttributes.value` is no longer supported. Instead, use the top-level property `defaultValue` to mimic the same ([uncontrolled](https://facebook.github.io/react/docs/forms.html#uncontrolled-components)) behavior.
  - Or, if you want to use the component in a [controlled](https://facebook.github.io/react/docs/forms.html#controlled-components) way, use the top-level `value` property.
