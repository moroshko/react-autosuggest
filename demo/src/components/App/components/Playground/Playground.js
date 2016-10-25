import styles from './Playground.less';
import theme from './theme.less';

import React, { Component } from 'react';
import Autosuggest from 'AutosuggestContainer';
import IsolatedScroll from 'react-isolated-scroll';
import createTrie from 'autosuggest-trie';
import match from 'autosuggest-highlight/match';
import parse from 'autosuggest-highlight/parse';
import countries from './countries';

const trie = createTrie(countries, 'name', {
  comparator: (countryA, countryB) =>
    countryA.population > countryB.population ? -1 : 1
});

const getSuggestions = value => trie.getMatches(value.trim());

const getSuggestionValue = suggestion => suggestion.name;

// TODO:
//   - match diacritics (e.g. Réunion)
//   - match 'Saint-Martin'

const renderSuggestionsContainer = ({ ref, ...rest }) => { // eslint-disable-line react/prop-types
  const callRef = isolatedScroll => {
    if (isolatedScroll !== null) {
      ref(isolatedScroll.component);
    }
  };

  return (
    <IsolatedScroll {...rest} ref={callRef} />
  );
};

const renderSuggestion = (suggestion, { query }) => {
  const matches = match(suggestion.name, query);
  const parts = parse(suggestion.name, matches);

  return (
    <div>
      <div>
        {
          parts.map((part, index) => (
            <span
              className={part.highlight ? styles.highlightedText : null}
              key={index}>
              {part.text}
            </span>
          ))
        }
      </div>
      <div className={styles.population}>
        Population: {suggestion.population}
      </div>
    </div>
  );
};

export default class Playground extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: []
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsFetchRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  onSuggestionsClearRequested = () => {
    this.setState({
      suggestions: []
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Search countries...',
      value,
      onChange: this.onChange
    };

    return (
      <div className={styles.container}>
        <h2 className={styles.header}>
          Playground
        </h2>
        <div className={styles.content}>
          <div className={styles.togglesContainer}>
            Toggles go here...
          </div>
          <div className={styles.autosuggestContainer}>
            <Autosuggest
              multiSection={false}
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionsClearRequested={this.onSuggestionsClearRequested}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              focusInputOnSuggestionClick={false}
              renderSuggestionsContainer={renderSuggestionsContainer}
              theme={theme}
              id="playground" />
          </div>
        </div>
      </div>
    );
  }
}
