import React, { Component } from 'react';
import Autosuggest from '../../src/Autosuggest';
import languages from '../plain-list/languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';

const getMatchingLanguages = (value) => {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter((language) => regex.test(language.name));
};

let app = null;

const onChange = (event, { newValue }) => {
  app.setState({
    value: newValue,
  });
};

const onSuggestionsFetchRequested = ({ value }) => {
  app.setState({
    suggestions: getMatchingLanguages(value),
  });
};

const onSuggestionsClearRequested = () => {
  app.setState({
    suggestions: [],
  });
};

const getSuggestionValue = (suggestion) => suggestion.name;

const renderSuggestion = (suggestion) => suggestion.name;

const renderInputComponent = ({ innerRef, ...otherInputProps }) => (
  <div>
    <input id="my-custom-input" {...otherInputProps} ref={innerRef} />
  </div>
);

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      suggestions: [],
    };

    this.autosuggest = React.createRef();
  }

  getInput() {
    return this.autosuggest.current.getInput();
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange,
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderInputComponent={renderInputComponent}
        inputProps={inputProps}
        ref={this.autosuggest}
      />
    );
  }
}
