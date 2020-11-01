import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/Autosuggest';
import languages from '../plain-list/languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';

const getMatchingLanguages = (value) => {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter((language) => regex.test(language.name));
};

let app = null;

export const getSuggestionValue = sinon.spy((suggestion) => {
  return suggestion.name;
});

export const renderSuggestion = sinon.spy((suggestion) => {
  return <span>{suggestion.name}</span>;
});

export const onChange = sinon.spy((event, { newValue }) => {
  app.setState({
    value: newValue,
  });
});

export const onSuggestionsFetchRequested = sinon.spy(({ value }) => {
  app.setState({
    suggestions: getMatchingLanguages(value),
  });
});

export const onSuggestionsClearRequested = sinon.spy(() => {
  app.setState({
    suggestions: [],
  });
});

export const onSuggestionSelected = sinon.spy();

export const onSuggestionHighlighted = sinon.spy(({ suggestion }) => {
  app.setState({
    highlightedSuggestion: suggestion,
  });
});

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      suggestions: [],
      highlightedSuggestion: null,
    };
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions.slice()}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        onSuggestionHighlighted={onSuggestionHighlighted}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        highlightFirstSuggestion={true}
      />
    );
  }
}
