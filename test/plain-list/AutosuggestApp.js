import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';
import highlight  from 'autosuggest-highlight';

function getMatchingLanguages(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
}

let app = null;

export const getSuggestionValue = sinon.spy(suggestion => {
  return suggestion.name;
});

export const renderSuggestion = sinon.spy((suggestion, { value, valueBeforeUpDown }) => {
  const query = (valueBeforeUpDown || value).trim();
  const matches = highlight.match(suggestion.name, query);
  const parts = highlight.parse(suggestion.name, matches);

  return parts.map((part, index) => {
    return part.highlight ?
      <strong key={index}>{part.text}</strong> :
      <span key={index}>{part.text}</span>;
  });
});

export const onChange = sinon.spy((event, { newValue, method }) => {
  if (method === 'type') {
    app.setState({
      value: newValue,
      suggestions: getMatchingLanguages(newValue)
    });
  } else {
    app.setState({
      value: newValue
    });
  }
});

export const shouldRenderSuggestions = sinon.spy(value => {
  return value.trim().length > 0 && value[0] !== ' ';
});

export const onSuggestionSelected = sinon.spy((event, { suggestionValue }) => {
  app.setState({
    suggestions: getMatchingLanguages(suggestionValue)
  });
});

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      suggestions: getMatchingLanguages('')
    };
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      id: 'my-awesome-autosuggest',
      placeholder: 'Type a programming language',
      type: 'search',
      value,
      onChange
    };

    return (
      <Autosuggest suggestions={suggestions}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps}
                   shouldRenderSuggestions={shouldRenderSuggestions}
                   onSuggestionSelected={onSuggestionSelected} />
    );
  }
}
