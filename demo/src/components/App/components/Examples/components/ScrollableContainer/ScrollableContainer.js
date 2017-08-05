import styles from './ScrollableContainer.less';
import theme from './theme.less';

import React, { Component } from 'react';
import Modal from 'react-modal';
import Autosuggest from 'Autosuggest';
import countries from './countries';
import { escapeRegexCharacters } from 'utils/utils';

const getSuggestions = value => {
  const escapedValue = escapeRegexCharacters(value.trim());

  if (escapedValue === '') {
    return countries;
  }

  const regex = new RegExp('^' + escapedValue, 'i');

  return countries.filter(country => regex.test(country.name));
};

const getSuggestionValue = suggestion => suggestion.name;

const renderSuggestion = suggestion => suggestion.name;

const modalStyle = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    fontFamily: '"Open Sans", sans-serif'
  },
  content: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    border: 0,
    padding: 0,
    overflow: 'hidden',
    outline: 'none',
    height: '100%'
  }
};

export default class ScrollableContainer extends Component {
  constructor() {
    super();

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
      <div id="scrollable-container-example" className={styles.container}>
        <div className={styles.textContainer}>
          <div className={styles.title}>Scrollable container</div>
          <div className={styles.description}>
            When the suggestions list is long, you may want to make it
            scrollable. Note that the suggestions are rendered even when the
            input field is not focused.
          </div>
        </div>
        <div className={styles.demoContainer}>
          <div className={styles.question}>Where do you live?</div>
          <div className={styles.answer}>
            {selected.name}
          </div>
          <button className={styles.editButton} onClick={this.openModal}>
            Edit
          </button>
        </div>
        <Modal
          isOpen={isModalOpen}
          contentLabel="Modal"
          onRequestClose={this.closeModal}
          shouldCloseOnOverlayClick={false}
          closeTimeoutMS={
            1 /* otherwise the modal is not closed when suggestion is selected by pressing Enter */
          }
          style={modalStyle}
        >
          <div className={styles.modalTitle}>Please select a country:</div>
          <div className={styles.modalBody}>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
              onSuggestionSelected={this.onSuggestionSelected}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              alwaysRenderSuggestions={true}
              theme={theme}
              id="scrollable-container-example"
            />
          </div>
          <button className={styles.cancelButton} onClick={this.closeModal}>
            Cancel
          </button>
        </Modal>
      </div>
    );
  }
}
