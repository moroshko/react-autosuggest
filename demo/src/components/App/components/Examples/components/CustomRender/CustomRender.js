import styles from './CustomRender.less';
import theme from './theme.less';

import React, { Component } from 'react';
import isMobile from 'ismobilejs';
import highlight  from 'autosuggest-highlight';
import Link from 'Link/Link';
import Autosuggest from 'AutosuggestContainer';
import people from './people';
import { escapeRegexCharacters } from 'utils/utils';

const focusInputOnSuggestionClick = !isMobile.any;

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return [];
  }

  const regex = new RegExp('\\b' + escapedValue, 'i');

  return people.filter(person => regex.test(getSuggestionValue(person)));
}

function getSuggestionValue(suggestion) {
  return `${suggestion.first} ${suggestion.last}`;
}

function renderSuggestion(suggestion, { value, valueBeforeUpDown }) {
  const suggestionText = `${suggestion.first} ${suggestion.last}`;
  const query = (valueBeforeUpDown || value).trim();
  const matches = highlight.match(suggestionText, query);
  const parts = highlight.parse(suggestionText, matches);

  return (
    <span className={theme.suggestionContent + ' ' + theme[suggestion.twitter]}>
      <span className={theme.name}>
        {
          parts.map((part, index) => {
            const className = part.highlight ? theme.highlight : null;

            return (
              <span className={className} key={index}>{part.text}</span>
            );
          })
        }
      </span>
    </span>
  );
}

export default class CustomRender extends Component {
  constructor() {
    super();

    this.state = {
      value: '',
      suggestions: getSuggestions('')
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
  }

  onChange(event, { newValue }) {
    this.setState({
      value: newValue
    });
  }

  onSuggestionsUpdateRequested({ value }) {
    this.setState({
      suggestions: getSuggestions(value)
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
      <div id="custom-render-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            Custom render
          </div>
          <div className={styles.description}>
            Apply any styling you wish.<br />
            For example, render images and highlight the matching string.
          </div>
          <Link
            className={styles.codepenLink}
            href="http://codepen.io/moroshko/pen/PZWbzK"
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
            theme={theme}
            id="custom-render-example" />
        </div>
      </div>
    );
  }
}
