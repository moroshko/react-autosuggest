import styles from './MultipleSections.less';
import theme from './theme.less';

import React, { Component } from 'react';
import Link from 'Link/Link';
import Autosuggest from 'AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from 'utils/utils';

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return languages
    .map(section => {
      return {
        title: section.title,
        languages: section.languages.filter(language => regex.test(language.name))
      };
    })
    .filter(section => section.languages.length > 0);
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionSuggestions(section) {
  return section.languages;
}

export default class MultipleSections extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: getSuggestions('')
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
  }

  onChange(event, { newValue, method }) {
    if (method === 'type') {
      this.setState({
        value: newValue,
        suggestions: getSuggestions(newValue)
      });
    } else {
      this.setState({
        value: newValue
      });
    }
  }

  onSuggestionSelected(event, { suggestionValue }) {
    this.setState({
      suggestions: getSuggestions(suggestionValue)
    });
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type \'c\'',
      value,
      onChange: this.onChange
    };

    return (
      <div id="multiple-sections-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            Multiple sections
          </div>
          <div className={styles.description}>
            Suggestions can also be presented in multiple sections.
          </div>
          <Link className={styles.codepenLink}
                href="http://codepen.io/moroshko/pen/qbRNjV" underline={false}>
            Codepen
          </Link>
        </div>
        <div className={styles.autosuggest}>
          <Autosuggest multiSection={true}
                       suggestions={suggestions}
                       getSuggestionValue={getSuggestionValue}
                       renderSuggestion={renderSuggestion}
                       renderSectionTitle={renderSectionTitle}
                       getSectionSuggestions={getSectionSuggestions}
                       inputProps={inputProps}
                       onSuggestionSelected={this.onSuggestionSelected}
                       theme={theme}
                       id="multiple-sections-example" />
        </div>
      </div>
    );
  }
}
