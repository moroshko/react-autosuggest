import styles from './AlwaysOpen.less';

import React, { Component } from 'react';
import isMobile from 'ismobilejs';
import Autosuggest from 'AutosuggestContainer';
import languages from './languages';
import { escapeRegexCharacters } from 'utils/utils';

const focusInputOnSuggestionClick = !isMobile.any;

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return languages;
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

export default class AlwaysOpen extends Component {
  constructor() {
    super();

    this.state = {
      isOpen: false,
      value: '',
      suggestions: getSuggestions('')
    };

    this.onChange = this.onChange.bind(this);
    this.onSuggestionsUpdateRequested = this.onSuggestionsUpdateRequested.bind(this);
    this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.onOpenModal = this.onToggleModal.bind(this, true);
    this.onCloseModal = this.onToggleModal.bind(this, false);
    this.onClickOverlay = this.onClickOverlay.bind(this);
  }

  onToggleModal(isOpen = !this.state.isOpen) {
    this.setState({
      isOpen: isOpen
    });

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }

  onClickOverlay(e) {
    const isOverlay = e.target.getAttribute('data-overlay');

    if (isOverlay) {
      this.onCloseModal();
      e.preventDefault();
    }
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

  onSuggestionSelected(e, { suggestionValue }) {
    this.setState({
      value: suggestionValue,
      suggestions: getSuggestions(suggestionValue)
    });

    this.onCloseModal();
  }

  render() {
    const { isOpen, value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type \'c\'',
      value,
      onChange: this.onChange
    };

    return (
      <div id="basic-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            Always open
          </div>
          <div className={styles.description}>
            Propose default suggestions even if the user hasn’t typed yet
          </div>
        </div>
        <div className={styles.autosuggest}>
          <a href="javascript:void(0)" onClick={this.onOpenModal} className={styles.button}>View suggestions</a>
          {isOpen ? (
            <div className={styles.overlay} data-overlay={true} onClick={this.onClickOverlay}>
              <div className={styles.modal}>
                <Autosuggest suggestions={suggestions}
                             onSuggestionsUpdateRequested={this.onSuggestionsUpdateRequested}
                             onSuggestionSelected={this.onSuggestionSelected}
                             getSuggestionValue={getSuggestionValue}
                             renderSuggestion={renderSuggestion}
                             inputProps={inputProps}
                             alwaysRenderSuggestions={true}
                             focusInputOnSuggestionClick={focusInputOnSuggestionClick}
                             id="alwaysopen-example"
                             theme={{
                               container: 'react-autosuggest__container',
                               containerOpen: 'react-autosuggest__container--open',
                               input: 'react-autosuggest__input',
                               suggestionsContainer: `react-autosuggest__suggestions-container ${styles.suggestionsContainer}`,
                               suggestion: 'react-autosuggest__suggestion',
                               suggestionFocused: 'react-autosuggest__suggestion--focused',
                               sectionContainer: 'react-autosuggest__section-container',
                               sectionTitle: 'react-autosuggest__section-title',
                               sectionSuggestionsContainer: 'react-autosuggest__section-suggestions-container'
                             }} />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
