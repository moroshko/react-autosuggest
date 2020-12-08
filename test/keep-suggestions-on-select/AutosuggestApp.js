import React, { Component } from 'react';
import Autosuggest from '../../src/Autosuggest';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils';
import languages from '../plain-list/languages';
import sinon from 'sinon';
import { addEvent } from '../helpers';

const getMatchingLanguages = (value) => {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter((language) => regex.test(language.name));
};

let app = null;

export const getSuggestionValue = (suggestion) => suggestion.name;

export const renderSuggestion = (suggestion) => <span>{suggestion.name}</span>;

export const onChange = sinon.spy((event, { newValue }) => {
  addEvent('onChange');

  app.setState({
    value: newValue,
  });
});

export const onSuggestionsFetchRequested = ({ value }) => {
  app.setState({
    suggestions: getMatchingLanguages(value),
  });
};

export const onSuggestionsClearRequested = () => {
  app.setState({
    suggestions: [],
  });
};

export const shouldKeepSuggestionsOnSelect = (suggestion) => {
  return suggestion.name.toLowerCase().startsWith('clo');
};

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      suggestions: [],
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
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldKeepSuggestionsOnSelect={shouldKeepSuggestionsOnSelect}
      />
    );
  }
}
