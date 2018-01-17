import styles from './Browsable.less';

import React, { Component } from 'react';
import isMobile from 'ismobilejs';
import Link from 'Link/Link';
import Autosuggest from 'Autosuggest';
import languages from './languages';
import { escapeRegexCharacters } from 'utils/utils';

const focusInputOnSuggestionClick = !isMobile.any;

const getSuggestions = value => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return languages;
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return languages.filter(language => regex.test(language.name));
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => <span>{suggestion.name}</span>;

export default class Browsable extends Component {
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
      placeholder: 'Click here',
      value,
      onChange: this.onChange
    };

    return (
      <div id="browsable-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>Browsable</div>
          <div className={styles.description}>
            Browsable, if click on input suggestion open
          </div>
        </div>
        <div className={styles.autosuggest}>
          <Autosuggest
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            inputProps={inputProps}
            browsable={true}
            focusInputOnSuggestionClick={focusInputOnSuggestionClick}
            id="browsable-example"
          />
        </div>
      </div>
    );
  }
}
