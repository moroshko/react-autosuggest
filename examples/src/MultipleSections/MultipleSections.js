'use strict';

import React, { Component } from 'react';
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
  const escapedInput = utils.escapeRegexCharacters(input.trim());
  const firstSectionMatchRegex = new RegExp('^' + escapedInput, 'i');
  const secondSectionMatchRegex = new RegExp('^(?!' + escapedInput + ')\\w+ ' + escapedInput, 'i');
  const thirdSectionMatchRegex = new RegExp('^(?!' + escapedInput + ')\\w+ (?!' + escapedInput + ')\\w+ ' + escapedInput, 'i');
  const firstSectionSuburbs = suburbs.filter( suburbObj => firstSectionMatchRegex.test(suburbObj.suburb) );
  const secondSectionSuburbs = suburbs.filter( suburbObj => secondSectionMatchRegex.test(suburbObj.suburb) );
  const thirdSectionSuburbs = suburbs.filter( suburbObj => thirdSectionMatchRegex.test(suburbObj.suburb) );
  const suggestions = [];
  let firstSectionCount, secondSectionCount, thirdSectionCount;

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

  setTimeout(() => callback(null, suggestions), 300);
}

export default class MultipleSections extends Component { // eslint-disable-line no-shadow
  render() {
    const inputAttributes = {
      id: 'multiple-sections',
      placeholder: 'Where do you work?'
    };

    return (
      <div>
        <Autosuggest suggestions={getSuggestions}
                     inputAttributes={inputAttributes}
                     ref={ () => document.getElementById('multiple-sections').focus() } />
        <SourceCodeLink file="examples/src/MultipleSections/MultipleSections.js" />
      </div>
    );
  }
}
