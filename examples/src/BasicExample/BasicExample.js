'use strict';

import React from 'react';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function getLocations(input, callback) {
  let suburbMatchRegex = new RegExp('^' + input, 'i');
  let locations = suburbs.filter(function(suburbObj) {
    return suburbObj.suburb.search(suburbMatchRegex) !== -1;
  }).slice(0, 7).map(function(suburbObj) {
    return suburbObj.suburb;
  });

  // 'locations' will be an array of strings, e.g.:
  //   ['Mentone', 'Mill Park', 'Mordialloc']

  setTimeout(function() {
    callback(null, locations);
  }, 300);
}

class BasicExample extends React.Component {
  render() {
    let inputAttributes = {
      id: 'basic-example',
      placeholder: 'Where do you live?'
    };

    return (
      <div>
        <Autosuggest inputAttributes={inputAttributes}
                     suggestions={getLocations}
                     ref={ () => { document.getElementById('basic-example').focus(); } } />
        <SourceCodeLink file="examples/src/BasicExample/BasicExample.js" />
      </div>
    );
  }
}

export default BasicExample;
