import styles from './Basic.less';

import React, { Component } from 'react';
import isMobile from 'ismobilejs';
import Link from 'Link/Link';
import Autosuggest from 'AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from 'utils/utils';

const focusInputOnSuggestionClick = !isMobile.any;

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

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

export default class Basic extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: getSuggestions('')
    };
  }

  onChange = (event, { newValue }) => {
    this.setState({
      value: newValue
    });
  };

  onSuggestionsUpdateRequested = ({ value }) => {
    this.setState({
      suggestions: getSuggestions(value)
    });
  };

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type \'c\'',
      value,
      onChange: this.onChange
    };

    return (
      <div id="basic-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            Basic
          </div>
          <div className={styles.description}>
            Let’s start simple. Here’s a plain list of suggestions.
          </div>
          <Link
            className={styles.codepenLink}
            href="http://codepen.io/moroshko/pen/LGNJMy"
            underline={false}>
            Codepen
          </Link>
        </div>
        <div className={styles.autosuggest}>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            focusInputOnSuggestionClick={focusInputOnSuggestionClick}
            id="basic-example" />
        </div>
      </div>
    );
  }
}
