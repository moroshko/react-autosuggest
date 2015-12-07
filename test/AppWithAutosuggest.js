import React, { Component, PropTypes } from 'react';
import Autosuggest from '../src/AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from '../demo/src/components/utils/utils.js';

function getMatchingLanguages(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

export default class AppWithAutosuggest extends Component {
  constructor() {
    super();

    this.state = {
      value: 'initial value',
      suggestions: languages
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  onChange(event, { newValue, method }) {
    if (method === 'type') {
      this.setState({
        value: newValue,
        suggestions: getMatchingLanguages(newValue)
      });
    } else {
      this.setState({
        value: newValue
      });
    }
  }

  onSuggestionSelected(event, { suggestionValue }) {
    this.setState({
      suggestions: getMatchingLanguages(suggestionValue)
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      id: 'my-awesome-autosuggest',
      placeholder: 'Type a programming language',
      type: 'search',
      value,
      onChange: this.onChange
    };

    return (
      <Autosuggest suggestions={suggestions}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps}
                   onSuggestionSelected={this.onSuggestionSelected} />
    );
  }
}
