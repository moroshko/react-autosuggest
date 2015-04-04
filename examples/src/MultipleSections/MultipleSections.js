'use strict';

import React from 'react';
import Autosuggest from '../../../src/Autosuggest';
import SourceCodeLink from '../SourceCodeLink/SourceCodeLink';
import suburbs from 'json!../suburbs.json';

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function suburbObjToString(suburbObj) {
  return suburbObj.suburb;
}

function getLocations(input, callback) {
  var firstSectionMatchRegex = new RegExp('^' + input, 'i');
  var secondSectionMatchRegex = new RegExp('^(?!' + input + ')\\w+ ' + input, 'i');
  var thirdSectionMatchRegex = new RegExp('^(?!' + input + ')\\w+ (?!' + input + ')\\w+ ' + input, 'i');

  var firstSectionSuburbs = suburbs.filter(function(suburbObj) {
    return suburbObj.suburb.search(firstSectionMatchRegex) !== -1;
  });

  var secondSectionSuburbs = suburbs.filter(function(suburbObj) {
    return suburbObj.suburb.search(secondSectionMatchRegex) !== -1;
  });

  var thirdSectionSuburbs = suburbs.filter(function(suburbObj) {
    return suburbObj.suburb.search(thirdSectionMatchRegex) !== -1;
  });

  var locations = [];
  var firstSectionCount, secondSectionCount, thirdSectionCount;

  if (thirdSectionSuburbs.length > 0) {
    thirdSectionCount = randomInt(1, Math.min(3, thirdSectionSuburbs.length));

    locations.unshift({
      sectionName: 'Third word match',
      suggestions: thirdSectionSuburbs.slice(0, thirdSectionCount).map(suburbObjToString)
    });
  }

  if (secondSectionSuburbs.length > 0) {
    secondSectionCount = randomInt(1, Math.min(3, secondSectionSuburbs.length));

    locations.unshift({
      sectionName: 'Second word match',
      suggestions: secondSectionSuburbs.slice(0, secondSectionCount).map(suburbObjToString)
    });
  }

  if (firstSectionSuburbs.length > 0) {
    firstSectionCount = Math.min(8 - secondSectionCount - thirdSectionCount, firstSectionSuburbs.length);

    locations.unshift({
      suggestions: firstSectionSuburbs.slice(0, firstSectionCount).map(suburbObjToString)
    });
  }

  // 'locations' will be an array of objects, e.g.:
  //   [{ suggestions: ['Mentone', 'Mill Park', 'Mordialloc'] },
  //    { sectionName: 'Second word match',
  //      suggestions: ['Altona Meadows', 'Bacchus Marsh'] },
  //    { sectionName: 'Third word match',
  //      suggestions: ['University Of Melbourne'] }]

  setTimeout(function() {
    callback(null, locations);
  }, 300);
}

class MultipleSections extends React.Component {
  render() {
    var inputAttributes = {
      id: 'multiple-sections',
      placeholder: 'Where do you work?'
    };

    return (
      <div>
        <Autosuggest inputAttributes={inputAttributes}
                     suggestions={getLocations}
                     ref={ () => { document.getElementById('multiple-sections').focus(); } } />
        <SourceCodeLink file="examples/src/MultipleSections/MultipleSections.js" />
      </div>
    );
  }
}

export default MultipleSections;
