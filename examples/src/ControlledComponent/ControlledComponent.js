require('./ControlledComponent.less');

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
    .filter(suburbObj => suburbMatchRegex.test(suburbObj.suburb + ' VIC ' + suburbObj.postcode))
    .sort((suburbObj1, suburbObj2) =>
      suburbObj1.suburb.toLowerCase().indexOf(lowercasedInput) -
      suburbObj2.suburb.toLowerCase().indexOf(lowercasedInput)
    )
    .slice(0, 7);

  // 'suggestions' will be an array of objects, e.g.:
  //   [{ suburb: 'Mordialloc', postcode: '3195' },
  //    { suburb: 'Mentone', postcode: '3194' },
  //    { suburb: 'Mill Park', postcode: '3082' }]

  callback(null, suggestions);
}

function renderSuggestion(suggestionObj, input) {
  const escapedInput = utils.escapeRegexCharacters(input);
  const suburbMatchRegex = new RegExp('\\b' + escapedInput, 'i');
  const suggestion = suggestionObj.suburb + ' VIC ' + suggestionObj.postcode;
  const firstMatchIndex = suggestion.search(suburbMatchRegex);

  if (firstMatchIndex === -1) {
    return suggestion;
  }

  const beforeMatch = suggestion.slice(0, firstMatchIndex);
  const match = suggestion.slice(firstMatchIndex, firstMatchIndex + input.length);
  const afterMatch = suggestion.slice(firstMatchIndex + input.length);

  return (
    <span>
      {beforeMatch}<strong>{match}</strong>{afterMatch}
    </span>
  );
}

function getSuggestionValue(suggestionObj) {
  return suggestionObj.suburb + ' VIC ' + suggestionObj.postcode;
}

export default class ControlledComponent extends Component {
  constructor() {
    super();

    this.state = {
      fromValue: '',
      toValue: ''
    };
  }

  setFromValue(fromValue) {
    this.setState({ fromValue });
  }

  setToValue(toValue) {
    this.setState({ toValue });
  }

  reverseSourceAndDestination() {
    const fromValue = this.state.toValue;
    const toValue = this.state.fromValue;

    this.setState({ fromValue, toValue });
  }

  render() {
    const inputAttributesFrom = {
      id: 'controlled-component-from',
      placeholder: 'Source',
      onChange: ::this.setFromValue
    };

    const inputAttributesTo = {
      placeholder: 'Destination',
      onChange: ::this.setToValue
    };

    return (
      <div className="controlled-component-example">
        <div className="from-container">
          <button onClick={() => this.setFromValue('Home')}>Home</button>
          <button onClick={() => this.setFromValue('Work')}>Work</button>
          <Autosuggest suggestions={getSuggestions}
                       suggestionRenderer={renderSuggestion}
                       suggestionValue={getSuggestionValue}
                       inputAttributes={inputAttributesFrom}
                       value={this.state.fromValue}
                       id="from" />
        </div>
        <div className="reverse-container">
          <button onClick={::this.reverseSourceAndDestination}>⇅</button>
        </div>
        <div className="to-container">
          <button onClick={() => this.setToValue('Bank')}>Bank</button>
          <button onClick={() => this.setToValue('Airport')}>Airport</button>
          <Autosuggest suggestions={getSuggestions}
                       suggestionRenderer={renderSuggestion}
                       suggestionValue={getSuggestionValue}
                       inputAttributes={inputAttributesTo}
                       value={this.state.toValue}
                       id="to" />
        </div>
        <SourceCodeLink file="examples/src/ControlledComponent/ControlledComponent.js" />
      </div>
    );
  }
}
