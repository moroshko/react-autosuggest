'use strict';

import React from 'react';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function getLocations(input, callback) {
  let suburbMatchRegex = new RegExp('^' + input, 'i');
  let locations = suburbs.filter(function(suburbObj) {
    return suburbObj.suburb.search(suburbMatchRegex) !== -1;
  }).slice(0, 7);
  let requestDelay = 50 + Math.floor(300 * Math.random());

  // 'locations' will be an array of objects, e.g.:
  //   [{ suburb: 'Mentone', postcode: '3194' },
  //    { suburb: 'Mill Park', postcode: '3082' },
  //    { suburb: 'Mordialloc', postcode: '3195' }]

  setTimeout(function() {
    callback(null, locations);
  }, requestDelay);
}

function renderLocation(suggestionObj, input) {
  let suburbMatchRegex = new RegExp('\\b' + input, 'i');
  let firstMatchIndex = suggestionObj.suburb.search(suburbMatchRegex);

  if (firstMatchIndex === -1) {
    return (
      <span>{suggestionObj.suburb} VIC {suggestionObj.postcode}</span>
    );
  }

  let beforeMatch = suggestionObj.suburb.slice(0, firstMatchIndex);
  let match = suggestionObj.suburb.slice(firstMatchIndex, firstMatchIndex + input.length);
  let afterMatch = suggestionObj.suburb.slice(firstMatchIndex + input.length);

  return (
    <span>{beforeMatch}<strong>{match}</strong>{afterMatch} VIC {suggestionObj.postcode}</span>
  );
}

class CustomRenderer extends React.Component {
  render() {
    let inputAttributes = {
      id: 'custom-renderer',
      placeholder: 'Where are you based?'
    };

    return (
      <div>
        <Autosuggest inputAttributes={inputAttributes}
                     suggestions={getLocations}
                     suggestionRenderer={renderLocation}
                     ref={ () => { document.getElementById('custom-renderer').focus(); } } />
        <SourceCodeLink file="examples/src/CustomRenderer/CustomRenderer.js" />
      </div>
    );
  }
}

export default CustomRenderer;
