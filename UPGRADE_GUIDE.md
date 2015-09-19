# Upgrade Guide

## 1.xx.xx -> 2.xx.xx

### Upgrade React

react-autosuggest 2.0 requires React 0.14.0-rc1 or above

### inputAttributes.value is no longer supported

To set the default value of an [uncontrolled](https://facebook.github.io/react/docs/forms.html#uncontrolled-components) component use [`defaultValue`](https://github.com/moroshko/react-autosuggest/#defaultValueOption).

**Before**

```xml
<Autosuggest inputAttributes={{ value: 'Mordialloc' }} ... />
```

**After**

```xml
<Autosuggest defaultValue="Mordialloc" ... />
```
