import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/Autosuggest';
import languages from '../plain-list/languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';
import { saveKeyDown } from '../helpers';

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

export const onSuggestionSelected = sinon.spy(() => {});

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => suggestion.name;

const renderTextarea = inputProps => (
  <textarea {...inputProps} />
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
      onChange,
      onKeyDown: saveKeyDown,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        onSuggestionSelected={onSuggestionSelected}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderTextarea}
        inputProps={inputProps}
        ref={this.storeAutosuggestReference}
      />
    );
  }
}
