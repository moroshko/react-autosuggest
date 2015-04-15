'use strict';

import React from 'react';
import utils from '../utils';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function suburbObjToString(suburbObj) {
  return suburbObj.suburb;
}

function getSuggestions(input, callback) {
  let escapedInput = utils.escapeRegexCharacters(input.trim());
  let firstSectionMatchRegex = new RegExp('^' + escapedInput, 'i');
  let secondSectionMatchRegex = new RegExp('^(?!' + escapedInput + ')\\w+ ' + escapedInput, 'i');
  let thirdSectionMatchRegex = new RegExp('^(?!' + escapedInput + ')\\w+ (?!' + escapedInput + ')\\w+ ' + escapedInput, 'i');
  let firstSectionSuburbs = suburbs.filter( suburbObj => firstSectionMatchRegex.test(suburbObj.suburb) );
  let secondSectionSuburbs = suburbs.filter( suburbObj => secondSectionMatchRegex.test(suburbObj.suburb) );
  let thirdSectionSuburbs = suburbs.filter( suburbObj => thirdSectionMatchRegex.test(suburbObj.suburb) );
  let suggestions = [], firstSectionCount, secondSectionCount, thirdSectionCount;

  if (thirdSectionSuburbs.length > 0) {
    thirdSectionCount = randomInt(1, Math.min(3, thirdSectionSuburbs.length));

    suggestions.unshift({
      sectionName: 'Third word match',
      suggestions: thirdSectionSuburbs.slice(0, thirdSectionCount).map(suburbObjToString)
    });
  }

  if (secondSectionSuburbs.length > 0) {
    secondSectionCount = randomInt(1, Math.min(3, secondSectionSuburbs.length));

    suggestions.unshift({
      sectionName: 'Second word match',
      suggestions: secondSectionSuburbs.slice(0, secondSectionCount).map(suburbObjToString)
    });
  }

  if (firstSectionSuburbs.length > 0) {
    firstSectionCount = Math.min(8 - secondSectionCount - thirdSectionCount, firstSectionSuburbs.length);

    suggestions.unshift({
      suggestions: firstSectionSuburbs.slice(0, firstSectionCount).map(suburbObjToString)
    });
  }

  // 'suggestions' will be an array of objects, e.g.:
  //   [{ suggestions: ['Mentone', 'Mill Park', 'Mordialloc'] },
  //    { sectionName: 'Second word match',
  //      suggestions: ['Altona Meadows', 'Bacchus Marsh'] },
  //    { sectionName: 'Third word match',
  //      suggestions: ['University Of Melbourne'] }]

  setTimeout(function() {
    callback(null, suggestions);
  }, 300);
}

class MultipleSections extends React.Component {
  render() {
    let inputAttributes = {
      id: 'multiple-sections',
      placeholder: 'Where do you work?'
    };

    return (
      <div>
        <Autosuggest suggestions={getSuggestions}
                     inputAttributes={inputAttributes}
                     ref={ () => { document.getElementById('multiple-sections').focus(); } } />
        <SourceCodeLink file="examples/src/MultipleSections/MultipleSections.js" />
      </div>
    );
  }
}

export default MultipleSections;
