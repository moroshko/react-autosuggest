import React, { Component } from 'react';
import sinon from 'sinon';
import highlight  from 'autosuggest-highlight';
import Autosuggest from '../../src/AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';
import { addEvent } from '../helpers';

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

export const onChange = sinon.spy((event, { newValue }) => {
  addEvent('onChange');

  app.setState({
    value: newValue
  });
});

export const onBlur = sinon.spy();
export const onSuggestionSelected = sinon.spy(() => {
  addEvent('onSuggestionSelected');
});

export const shouldRenderSuggestions = sinon.spy(value => {
  return value.trim().length > 0 && value[0] !== ' ';
});

export const onSuggestionsUpdateRequested = sinon.spy(({ value }) => {
  app.setState({
    suggestions: getMatchingLanguages(value)
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
      onChange,
      onBlur
    };

    return (
      <Autosuggest suggestions={suggestions}
                   onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps}
                   shouldRenderSuggestions={shouldRenderSuggestions}
                   onSuggestionSelected={onSuggestionSelected} />
    );
  }
}
