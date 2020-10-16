import React, { Component } from 'react';
import sinon from 'sinon';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import Autosuggest from '../../src/Autosuggest';
import languages from './languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';
import { addEvent, saveKeyDown } from '../helpers';

const getMatchingLanguages = value => {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
};

let app = null;

export const getSuggestionValue = sinon.spy(suggestion => {
  return suggestion.name;
});

export const renderSuggestion = sinon.spy((suggestion, { query }) => {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return parts.map((part, index) => {
    return part.highlight ? (
      <strong key={index}>{part.text}</strong>
    ) : (
      <span key={index}>{part.text}</span>
    );
  });
});

export const onChange = sinon.spy((event, { newValue }) => {
  addEvent('onChange');

  app.setState({
    value: newValue
  });
});

export const onFocus = sinon.spy();
export const onBlur = sinon.spy();

export const defaultShouldRenderSuggestionsStub = (value) => {
  return value.trim().length > 0 && value[0] !== ' ';
};
export const shouldRenderSuggestions = sinon.stub().callsFake(defaultShouldRenderSuggestionsStub);

export const onSuggestionsFetchRequested = sinon.spy(({ value }) => {
  app.setState({
    suggestions: getMatchingLanguages(value)
  });
});

export const onSuggestionsClearRequested = sinon.spy(() => {
  app.setState({
    suggestions: []
  });
});

export const onSuggestionSelected = sinon.spy(() => {
  addEvent('onSuggestionSelected');
});

export const onSuggestionHighlighted = sinon.spy(() => {
  addEvent('onSuggestionHighlighted');
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

  storeAutosuggestReference = autosuggest => {
    if (autosuggest !== null) {
      this.input = autosuggest.input;
    }
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      id: 'my-awesome-autosuggest',
      placeholder: 'Type a programming language',
      type: 'search',
      onKeyDown: saveKeyDown,
      value,
      onChange,
      onFocus,
      onBlur
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        onSuggestionSelected={onSuggestionSelected}
        onSuggestionHighlighted={onSuggestionHighlighted}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={shouldRenderSuggestions}
        ref={this.storeAutosuggestReference}
      />
    );
  }
}
