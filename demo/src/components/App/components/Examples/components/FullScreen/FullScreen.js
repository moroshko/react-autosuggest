import styles from './FullScreen.less';
import theme from './theme.less';
import flags from './flags.less';

import React, { Component } from 'react';
import Modal from 'react-aria-modal';
import isMobile from 'ismobilejs';
import Link from 'Link/Link';
import Autosuggest from 'AutosuggestContainer';
import countries from './countries';
import { escapeRegexCharacters } from 'utils/utils';

const focusInputOnSuggestionClick = !isMobile.any;

const getSuggestions = value => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return countries;
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return countries.filter(country => regex.test(country.name));
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => {
  return (
    <div className={styles.suggestion}>
      <span className={flags[suggestion.code]} />
      <span className={styles.suggestionText}>{suggestion.name}</span>
    </div>
  );
};

export default class FullScreen extends Component {
  constructor() {
    super();

    this.appNode = document.getElementById('demo');

    this.state = {
      isModalOpen: false,
      selected: countries.filter(country => country.name === 'Australia')[0],
      value: '',
      suggestions: countries
    };
  }

  openModal = () => {
    this.setState({
      isModalOpen: true,
      value: '',
      suggestions: countries
    });
  };

  closeModal = () => {
    this.setState({
      isModalOpen: false
    });
  };

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

  onSuggestionSelected = (event, { suggestion }) => {
    this.setState({
      isModalOpen: false,
      selected: suggestion
    });
  };

  render() {
    const { isModalOpen, selected, value, suggestions } = this.state;
    const inputProps = {
      placeholder: 'Type to filter',
      value,
      onChange: this.onChange
    };

    return (
      <div id="full-screen-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>
            Full Screen
          </div>
          <div className={styles.description}>
            Sometimes, it is useful to show suggestions even when
            the input field is not focused.
          </div>
          <Link
            className={styles.codepenLink}
            href=""
            underline={false}>
            Codepen
          </Link>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.countryTitle}>COUNTRY</div>
          <div className={styles.selected}>
            <span className={flags[selected.code]} />
            <span className={styles.selectedText}>{selected.name}</span>
          </div>
          <button className={styles.changeButton} onClick={this.openModal}>
            Change
          </button>
        </div>
        <Modal
          underlayClass={styles.overlay}
          underlayColor="#fff"
          dialogClass={styles.modal}
          mounted={isModalOpen}
          titleText="Country"
          underlayClickExits={false}
          escapeExits={false}
          onExit={this.closeModal}
          applicationNode={this.appNode}>
          <div className={styles.modalTitle}>
            Please select a country:
          </div>
          <div className={styles.modalBody}>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionSelected={this.onSuggestionSelected}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              alwaysRenderSuggestions={true}
              focusInputOnSuggestionClick={focusInputOnSuggestionClick}
              theme={theme}
              id="full-screen-example" />
          </div>
          <button className={styles.cancelButton} onClick={this.closeModal}>
            Cancel
          </button>
        </Modal>
      </div>
    );
  }
}
