'use strict';

import React, { Component } from 'react';
import utils from '../utils';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function getSuggestions(input, callback) {
  const escapedInput = utils.escapeRegexCharacters(input.trim());
  const lowercasedInput = input.trim().toLowerCase();
  const suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
  const suggestions = suburbs
    .filter( suburbObj => suburbMatchRegex.test(suburbObj.suburb) )
    .sort( (suburbObj1, suburbObj2) =>
      suburbObj1.suburb.toLowerCase().indexOf(lowercasedInput) -
      suburbObj2.suburb.toLowerCase().indexOf(lowercasedInput)
    )
    .slice(0, 7)
    .map( suburbObj => suburbObj.suburb );

  // 'suggestions' will be an array of strings, e.g.:
  //   ['Mentone', 'Mill Park', 'Mordialloc']

  setTimeout(() => callback(null, suggestions), 300);
}

export default class BasicExample extends Component { // eslint-disable-line no-shadow
  render() {
    const inputAttributes = {
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
