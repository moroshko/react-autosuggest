import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/Autosuggest';
import languages from '../plain-list/languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';

const getMatchingLanguages = value => {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
};

let app = null;

const onChange = (event, { newValue }) => {
  app.setState({
    value: newValue
  });
};

const onSuggestionsFetchRequested = ({ value }) => {
  app.setState({
    suggestions: getMatchingLanguages(value)
  });
};

const onSuggestionsClearRequested = () => {
  app.setState({
    suggestions: []
  });
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => suggestion.name;

export const renderSuggestionsContainer = sinon.spy(
  ({ containerProps, children, query }) =>
    <div {...containerProps}>
      {children}
      <div className="my-suggestions-container-footer">
        Press Enter to search <strong className="my-query">{query}</strong>
      </div>
    </div>
);

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      suggestions: []
    };
  }

  storeAutosuggestReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };

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
        renderSuggestionsContainer={renderSuggestionsContainer}
        inputProps={inputProps}
        ref={this.storeAutosuggestReference}
      />
    );
  }
}
