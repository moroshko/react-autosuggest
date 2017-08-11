import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/Autosuggest';
import languages from './languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';

const getMatchingLanguages = value => {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages
    .map(section => {
      return {
        title: section.title,
        languages: section.languages.filter(language =>
          regex.test(language.name)
        )
      };
    })
    .filter(section => section.languages.length > 0);
};

let app = null;

export const getSuggestionValue = sinon.spy(suggestion => {
  return suggestion.name;
});

export const renderSuggestion = sinon.spy(suggestion => {
  return (
    <span>
      {suggestion.name}
    </span>
  );
});

const alwaysTrue = () => true;

export const onChange = sinon.spy((event, { newValue }) => {
  app.setState({
    value: newValue
  });
});

export const onBlur = sinon.spy();

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

export const onSuggestionSelected = sinon.spy();

export const onSuggestionHighlighted = sinon.spy();

export const renderSectionTitle = sinon.spy(section => {
  return (
    <strong>
      {section.title}
    </strong>
  );
});

export const getSectionSuggestions = sinon.spy(section => {
  return section.languages;
});

let highlightFirstSuggestion = false;

export const setHighlightFirstSuggestion = value => {
  highlightFirstSuggestion = value;
};

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onClearMouseDown = event => {
    event.preventDefault();

    this.setState({
      value: '',
      suggestions: getMatchingLanguages('')
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange,
      onBlur
    };

    return (
      <div>
        <button onMouseDown={this.onClearMouseDown}>Clear</button>
        <Autosuggest
          multiSection={true}
          suggestions={suggestions}
          onSuggestionsFetchRequested={onSuggestionsFetchRequested}
          onSuggestionsClearRequested={onSuggestionsClearRequested}
          onSuggestionSelected={onSuggestionSelected}
          onSuggestionHighlighted={onSuggestionHighlighted}
          getSuggestionValue={getSuggestionValue}
          renderSuggestion={renderSuggestion}
          inputProps={inputProps}
          shouldRenderSuggestions={alwaysTrue}
          renderSectionTitle={renderSectionTitle}
          getSectionSuggestions={getSectionSuggestions}
          highlightFirstSuggestion={highlightFirstSuggestion}
        />
      </div>
    );
  }
}
