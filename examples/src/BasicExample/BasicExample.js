'use strict';

import React from 'react';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function getSuggestions(input, callback) {
  let suburbMatchRegex = new RegExp('^' + input, 'i');
  let suggestions = suburbs
    .filter( suburbObj => suburbMatchRegex.test(suburbObj.suburb) )
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
        <Autosuggest inputAttributes={inputAttributes}
                     suggestions={getSuggestions}
                     ref={ () => { document.getElementById('basic-example').focus(); } } />
        <SourceCodeLink file="examples/src/BasicExample/BasicExample.js" />
      </div>
    );
  }
}

export default BasicExample;
