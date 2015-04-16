'use strict';

import React, { Component } from 'react';
import utils from '../utils';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function population(suburbObj) {
  return suburbObj.suburb.split('').reduce((result, char) => result + char.charCodeAt(0), 0) +
         +suburbObj.postcode.split('').reverse().join('');
}

function getSuggestions(input, callback) {
  let requestDelay = 50 + Math.floor(300 * Math.random());
  let escapedInput = utils.escapeRegexCharacters(input.trim());
  let lowercasedInput = input.trim().toLowerCase();
  let suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
  let suggestions = suburbs
    .filter( suburbObj => suburbMatchRegex.test(suburbObj.suburb + ' VIC ' + suburbObj.postcode) )
    .sort( (suburbObj1, suburbObj2) =>
      suburbObj1.suburb.toLowerCase().indexOf(lowercasedInput) -
      suburbObj2.suburb.toLowerCase().indexOf(lowercasedInput)
    )
    .slice(0, 7)
    .map( suburbObj => {
      suburbObj.population = population(suburbObj);
      return suburbObj;
    } )
    .sort( (suburbObj1, suburbObj2) => suburbObj2.population - suburbObj1.population );

  // 'suggestions' will be an array of objects, e.g.:
  //   [{ suburb: 'Mordialloc', postcode: '3195', population: 6943 },
  //    { suburb: 'Mentone', postcode: '3194', population: 5639 },
  //    { suburb: 'Mill Park', postcode: '3082', population: 3631 }]

  setTimeout(() => callback(null, suggestions), requestDelay);
}

function renderSuggestion(suggestionObj, input) {
  let escapedInput = utils.escapeRegexCharacters(input);
  let suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
  let suggestion = suggestionObj.suburb + ' VIC ' + suggestionObj.postcode;
  let firstMatchIndex = suggestion.search(suburbMatchRegex);

  if (firstMatchIndex === -1) {
    return suggestion;
  }

  let beforeMatch = suggestion.slice(0, firstMatchIndex);
  let match = suggestion.slice(firstMatchIndex, firstMatchIndex + input.length);
  let afterMatch = suggestion.slice(firstMatchIndex + input.length);

  return (
    <span>
      {beforeMatch}<strong>{match}</strong>{afterMatch}<br />
      <small style={{ color: '#777' }}>Population: {suggestionObj.population}</small>
    </span>
  );
}

function getSuggestionValue(suggestionObj) {
  return suggestionObj.suburb + ' VIC ' + suggestionObj.postcode;
}

export default class CustomRenderer extends Component {
  render() {
    let inputAttributes = {
      id: 'custom-renderer',
      placeholder: 'Where are you based?'
    };

    return (
      <div>
        <Autosuggest suggestions={getSuggestions}
                     suggestionRenderer={renderSuggestion}
                     suggestionValue={getSuggestionValue}
                     inputAttributes={inputAttributes}
                     ref={ () => { document.getElementById('custom-renderer').focus(); } } />
        <SourceCodeLink file="examples/src/CustomRenderer/CustomRenderer.js" />
      </div>
    );
  }
}
