let data, multipleSections;

function setData(newData) {
  data = newData;
  multipleSections = (typeof data === 'object');
}

function nextNonEmptySectionIndex(sectionIndex) {
  if (sectionIndex === null) {
    sectionIndex = 0;
  } else {
    sectionIndex++;
  }

  while (sectionIndex < data.length && data[sectionIndex] === 0) {
    sectionIndex++;
  }

  return sectionIndex === data.length ? null : sectionIndex;
}

function prevNonEmptySectionIndex(sectionIndex) {
  if (sectionIndex === null) {
    sectionIndex = data.length - 1;
  } else {
    sectionIndex--;
  }

  while (sectionIndex >= 0 && data[sectionIndex] === 0) {
    sectionIndex--;
  }

  return sectionIndex === -1 ? null : sectionIndex;
}

function next(position) {
  let [sectionIndex, itemIndex] = position;

  if (multipleSections) {
    if (itemIndex === null || itemIndex === data[sectionIndex] - 1) {
      sectionIndex = nextNonEmptySectionIndex(sectionIndex);

      if (sectionIndex === null) {
        return [null, null];
      }

      return [sectionIndex, 0];
    }

    return [sectionIndex, itemIndex + 1];
  }

  if (data === 0 || itemIndex === data - 1) {
    return [null, null];
  }

  if (itemIndex === null) {
    return [null, 0];
  }

  return [null, itemIndex + 1];
}

function prev(position) {
  let [sectionIndex, itemIndex] = position;

  if (multipleSections) {
    if (itemIndex === null || itemIndex === 0) {
      sectionIndex = prevNonEmptySectionIndex(sectionIndex);

      if (sectionIndex === null) {
        return [null, null];
      }

      return [sectionIndex, data[sectionIndex] - 1];
    }

    return [sectionIndex, itemIndex - 1];
  }

  if (data === 0 || itemIndex === 0) {
    return [null, null];
  }

  if (itemIndex === null) {
    return [null, data - 1];
  }

  return [null, itemIndex - 1];
}

function isLast(position) {
  return next(position)[1] === null;
}

export default {
  setData,
  next,
  prev,
  isLast
};
