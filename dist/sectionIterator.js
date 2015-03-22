"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var data, multipleSections;

function setData(newData) {
  data = newData;
  multipleSections = typeof data === "object";
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
  var _position = _slicedToArray(position, 2);

  var sectionIndex = _position[0];
  var itemIndex = _position[1];

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
  var _position = _slicedToArray(position, 2);

  var sectionIndex = _position[0];
  var itemIndex = _position[1];

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

module.exports = {
  setData: setData,
  next: next,
  prev: prev
};
