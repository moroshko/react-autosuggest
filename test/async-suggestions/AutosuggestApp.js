import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/Autosuggest';
import languages from '../plain-list/languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';

const getMatchingLanguages = value => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
};

let app = null;

export const getSuggestionValue = sinon.spy(suggestion => suggestion.name);

export const renderSuggestion = sinon.spy(suggestion => suggestion.name);

export const onChange = sinon.spy((event, { newValue }) => {
  app.setState({
    value: newValue
  });
});

const loadSuggestions = value => {
  setTimeout(() => {
    if (value === app.state.value) {
      app.setState({
        suggestions: getMatchingLanguages(value)
      });
    }
  }, 100);
};

export const onSuggestionsFetchRequested = sinon.spy(({ value }) => {
  loadSuggestions(value);
});

export const onSuggestionsClearRequested = sinon.spy(() => {
  app.setState({
    suggestions: []
  });
});

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      suggestions: []
    };
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        highlightFirstSuggestion={true}
      />
    );
  }
}
