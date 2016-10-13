import React, { Component } from 'react';
import Autosuggest from '../../src/AutosuggestContainer';
import CustomInput from './CustomInput';
import languages from '../plain-list/languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';

function getMatchingLanguages(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
}

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
        inputComponent={CustomInput}
        inputProps={inputProps}
      />
    );
  }
}
