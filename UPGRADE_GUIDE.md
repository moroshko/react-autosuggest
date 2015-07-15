# Upgrade Guide

### 1.xx.xx -> 2.xx.xx

- **Breaking:** `inputAttributes.value` is no longer supported.
  Instead, use
  <a href="https://github.com/moroshko/react-autosuggest/#defaultValueOption" target="_blank" alt="defaultValue">`defaultValue`</a>
  to mimic the same
  ([uncontrolled](https://facebook.github.io/react/docs/forms.html#uncontrolled-components))
  behavior.
