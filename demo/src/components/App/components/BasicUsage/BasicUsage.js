import styles from './BasicUsage.less';

import React, { Component, PropTypes } from 'react';
import Autosuggest from 'AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from 'utils/utils';

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

export default class Example extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: getMatchingLanguages('')
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

  // When suggestion is selected, we need to update `suggestions` so that,
  // if user presses Up or Down to reveal suggestions,
  // they would see the updated list.
  onSuggestionSelected(event, { suggestionValue }) {
    this.setState({
      suggestions: getMatchingLanguages(suggestionValue)
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type a programming language',
      value,
      onChange: this.onChange
    };

    return (
      <div className={styles.container}>
        <h3 id="basic-usage">Basic usage</h3>
        <div className={styles.content}>
          <ul className={styles.info}>
            <li>Plain list of suggestions</li>
          </ul>
          <Autosuggest suggestions={suggestions}
                       getSuggestionValue={getSuggestionValue}
                       renderSuggestion={renderSuggestion}
                       inputProps={inputProps}
                       onSuggestionSelected={this.onSuggestionSelected} />
        </div>
      </div>
    );
  }
}
