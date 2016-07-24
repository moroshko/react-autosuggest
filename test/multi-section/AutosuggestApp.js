import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';

function getMatchingLanguages(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.map(section => {
    return {
      title: section.title,
      languages: section.languages.filter(language => regex.test(language.name))
    };
  }).filter(section => section.languages.length > 0);
}

let app = null;

export const getSuggestionValue = sinon.spy(suggestion => {
  return suggestion.name;
});

export const renderSuggestion = sinon.spy(suggestion => {
  return (
    <span>{suggestion.name}</span>
  );
});

function shouldRenderSuggestions() {
  return true;
}

export const onChange = sinon.spy((event, { newValue }) => {
  app.setState({
    value: newValue
  });
});

export const onBlur = sinon.spy();
export const onSuggestionSelected = sinon.spy();

export const onSuggestionsUpdateRequested = sinon.spy(({ value }) => {
  app.setState({
    suggestions: getMatchingLanguages(value)
  });
});

export const renderSectionTitle = sinon.spy(section => {
  return (
    <strong>{section.title}</strong>
  );
});

export const getSectionSuggestions = sinon.spy(section => {
  return section.languages;
});

let focusFirstSuggestion = false;

export function setFocusFirstSuggestion(value) {
  focusFirstSuggestion = value;
}

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
      value,
      onChange,
      onBlur
    };

    return (
      <Autosuggest
        multiSection={true}
        suggestions={suggestions}
        onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        shouldRenderSuggestions={shouldRenderSuggestions}
        onSuggestionSelected={onSuggestionSelected}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        focusInputOnSuggestionClick={false}
        focusFirstSuggestion={focusFirstSuggestion} />
    );
  }
}
