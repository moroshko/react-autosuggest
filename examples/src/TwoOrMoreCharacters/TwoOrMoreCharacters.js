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

function showWhen(input) {
  return input.trim().length >= 2;
}

class TwoOrMoreCharacters extends React.Component {
  render() {
    let inputAttributes = {
      id: 'two-or-more-characters',
      placeholder: 'Where are you now?'
    };

    return (
      <div>
        <Autosuggest suggestions={getSuggestions}
                     showWhen={showWhen}
                     inputAttributes={inputAttributes}
                     ref={ () => { document.getElementById('two-or-more-characters').focus(); } } />
        <SourceCodeLink file="examples/src/TwoOrMoreCharacters/TwoOrMoreCharacters.js" />
      </div>
    );
  }
}

export default TwoOrMoreCharacters;
