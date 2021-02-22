import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/Autosuggest';
import languages from '../plain-list/languages';
import { escapeRegexCharacters } from '../../demo/src/components/utils/utils.js';

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
    suggestions: [{ title: 'languages', languages: getMatchingLanguages(value) }]
  });
};

const onSuggestionsClearRequested = () => {
  app.setState({
    suggestions: []
  });
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => suggestion.name;

export const renderSectionContainer = sinon.spy(
  ({ containerProps, children, query, section }) => <div {...containerProps}>
    <div className="my-section-container-header">
      Showing results for <strong className="my-query">{query}</strong> in {section.title}
    </div>
    {children}
  </div>
);

const renderSectionTitle = () => null;

const getSectionSuggestions = section => section.languages;

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

  alwaysRenderSuggestions = () => true;

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange
    };

    return (
      <Autosuggest
        multiSection={true}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        alwaysRenderSuggestions={this.alwaysRenderSuggestions}
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionContainer={renderSectionContainer}
        inputProps={inputProps}
        ref={this.storeAutosuggestReference}
      />
    );
  }
}
