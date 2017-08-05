import styles from './MultipleSections.less';
import theme from './theme.less';

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
    return [];
  }

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

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion =>
  <span>
    {suggestion.name}
  </span>;

const renderSectionTitle = section =>
  <strong>
    {section.title}
  </strong>;

const getSectionSuggestions = section => section.languages;

export default class MultipleSections extends Component {
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
      placeholder: "Type 'c'",
      value,
      onChange: this.onChange
    };

    return (
      <div id="multiple-sections-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>Multiple sections</div>
          <div className={styles.description}>
            Suggestions can also be presented in multiple sections. Note that we
            highlight the first suggestion by default here.
          </div>
          <Link
            className={styles.codepenLink}
            href="http://codepen.io/moroshko/pen/qbRNjV"
            underline={false}
          >
            Codepen
          </Link>
        </div>
        <div className={styles.autosuggest}>
          <Autosuggest
            multiSection={true}
            suggestions={suggestions}
            onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
            onSuggestionsClearRequested={this.onSuggestionsClearRequested}
            getSuggestionValue={getSuggestionValue}
            renderSuggestion={renderSuggestion}
            renderSectionTitle={renderSectionTitle}
            getSectionSuggestions={getSectionSuggestions}
            inputProps={inputProps}
            highlightFirstSuggestion={true}
            focusInputOnSuggestionClick={focusInputOnSuggestionClick}
            theme={theme}
            id="multiple-sections-example"
          />
        </div>
      </div>
    );
  }
}
