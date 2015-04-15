'use strict';

import React from 'react';
import utils from '../utils';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function getSuggestions(input, callback) {
  let escapedInput = utils.escapeRegexCharacters(input.trim());
  let lowercasedInput = input.trim().toLowerCase();
  let suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
  let suggestions = suburbs
    .filter( suburbObj => suburbMatchRegex.test(suburbObj.suburb) )
    .sort( (suburbObj1, suburbObj2) =>
      suburbObj1.suburb.toLowerCase().indexOf(lowercasedInput) -
      suburbObj2.suburb.toLowerCase().indexOf(lowercasedInput)
    )
    .slice(0, 7)
    .map( suburbObj => suburbObj.suburb );

  // 'suggestions' will be an array of strings, e.g.:
  //   ['Mentone', 'Mill Park', 'Mordialloc']

  setTimeout(function() {
    callback(null, suggestions);
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
        <Autosuggest suggestions={getSuggestions}
                     inputAttributes={inputAttributes}
                     ref={ () => { document.getElementById('basic-example').focus(); } } />
        <SourceCodeLink file="examples/src/BasicExample/BasicExample.js" />
      </div>
    );
  }
}

export default BasicExample;
