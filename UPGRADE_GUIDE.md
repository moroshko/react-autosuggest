# Upgrade Guide

## 1.xx.xx -> 2.xx.xx

### `inputAttributes.value` is no longer supported

Use [`defaultValue`](https://github.com/moroshko/react-autosuggest/#defaultValueOption) instead.

**Before**

```xml
<Autosuggest inputAttributes={{ value: 'Mordialloc' }} ... />
```

**After**

```xml
<Autosuggest defaultValue="Mordialloc" ... />
```
