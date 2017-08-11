import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/Autosuggest';
import languages from '../plain-list/languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';
import { addEvent } from '../helpers';

const getMatchingLanguages = value => {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
};

let app = null;

export const getSuggestionValue = suggestion => suggestion.name;

export const renderSuggestion = suggestion =>
  <span>
    {suggestion.name}
  </span>;

export const onChange = sinon.spy((event, { newValue }) => {
  addEvent('onChange');

  app.setState({
    value: newValue
  });
});

export const onSuggestionsFetchRequested = ({ value }) => {
  app.setState({
    suggestions: getMatchingLanguages(value)
  });
};

export const onSuggestionsClearRequested = () => {
  app.setState({
    suggestions: []
  });
};

export const onSuggestionSelected = sinon.spy(() => {
  addEvent('onSuggestionSelected');

  app.setState({ value: '' });
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
        suggestions={suggestions.slice()}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        highlightFirstSuggestion={true}
      />
    );
  }
}
