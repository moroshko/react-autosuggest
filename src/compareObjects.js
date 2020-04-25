export default function compareObjects(objA, objB, keys = []) {
  if (objA === objB) {
    return false;
  }

  const aKeys = Object.keys(objA);
  const bKeys = Object.keys(objB);

  if (aKeys.length !== bKeys.length) {
    return true;
  }

  const keysMap = {};
  let i, len;

  for (i = 0, len = keys.length; i < len; i++) {
    keysMap[keys[i]] = true;
  }

  for (i = 0, len = aKeys.length; i < len; i++) {
    let key = aKeys[i];
    const aValue = objA[key];
    const bValue = objB[key];

    if (aValue === bValue) {
      continue;
    }

    if (
      !keysMap[key] ||
      aValue === null ||
      bValue === null ||
      typeof aValue !== 'object' ||
      typeof bValue !== 'object'
    ) {
      return true;
    }

    const aValueKeys = Object.keys(aValue);
    const bValueKeys = Object.keys(bValue);

    if (aValueKeys.length !== bValueKeys.length) {
      return true;
    }

    for (let n = 0, { length } = aValueKeys; n < length; n++) {
      const aValueKey = aValueKeys[n];

      if (aValue[aValueKey] !== bValue[aValueKey]) {
        return true;
      }
    }
  }

  return false;
}
