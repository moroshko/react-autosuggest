import React, { Component, PropTypes } from 'react';
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

export const onSuggestionSelected = sinon.spy((event, { suggestionValue }) => {
  app.setState({
    suggestions: getMatchingLanguages(suggestionValue)
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
      onChange
    };

    return (
      <Autosuggest multiSection={true}
                   suggestions={suggestions}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps}
                   onSuggestionSelected={onSuggestionSelected}
                   renderSectionTitle={renderSectionTitle}
                   getSectionSuggestions={getSectionSuggestions} />
    );
  }
}
