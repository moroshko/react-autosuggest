import React, { Component, PropTypes } from 'react';
import { createStore } from 'redux';
import reducer from './redux';
import Autosuggest from './Autosuggest';

const alwaysTrue = () => true;
const defaultShouldRenderSuggestions = value => value.trim().length > 0;
const defaultTheme = {
  container: 'react-autosuggest__container',
  containerOpen: 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestionsList: 'react-autosuggest__suggestions-list',
  suggestion: 'react-autosuggest__suggestion',
  suggestionFocused: 'react-autosuggest__suggestion--focused',
  sectionContainer: 'react-autosuggest__section-container',
  sectionTitle: 'react-autosuggest__section-title'
};

const mapToAutowhateverTheme = theme => {
  let result = {};

  for (const key in theme) {
    switch (key) {
      case 'suggestionsContainer':
        result['itemsContainer'] = theme[key];
        break;

      case 'suggestion':
        result['item'] = theme[key];
        break;

      case 'suggestionFocused':
        result['itemFocused'] = theme[key];
        break;

      case 'suggestionsList':
        result['itemsList'] = theme[key];
        break;

      default:
        result[key] = theme[key];
    }
  }

  return result;
};

export default class AutosuggestContainer extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    onSuggestionsFetchRequested: (props, propName) => {
      const onSuggestionsFetchRequested = props[propName];

      if (typeof onSuggestionsFetchRequested !== 'function') {
        throw new Error('\'onSuggestionsFetchRequested\' must be implemented. See: https://github.com/moroshko/react-autosuggest#onSuggestionsFetchRequestedProp');
      }
    },
    onSuggestionsClearRequested: (props, propName) => {
      const onSuggestionsClearRequested = props[propName];

      if (props.alwaysRenderSuggestions === false && typeof onSuggestionsClearRequested !== 'function') {
        throw new Error('\'onSuggestionsClearRequested\' must be implemented. See: https://github.com/moroshko/react-autosuggest#onSuggestionsClearRequestedProp');
      }
    },
    onSuggestionSelected: PropTypes.func,
    renderInputComponent: PropTypes.func,
    renderSuggestionsContainer: PropTypes.func,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: (props, propName) => {
      const inputProps = props[propName];

      if (!inputProps.hasOwnProperty('value')) {
        throw new Error('\'inputProps\' must have \'value\'.');
      }

      if (!inputProps.hasOwnProperty('onChange')) {
        throw new Error('\'inputProps\' must have \'onChange\'.');
      }
    },
    shouldRenderSuggestions: PropTypes.func,
    alwaysRenderSuggestions: PropTypes.bool,
    multiSection: PropTypes.bool,
    renderSectionTitle: (props, propName) => {
      const renderSectionTitle = props[propName];

      if (props.multiSection === true && typeof renderSectionTitle !== 'function') {
        throw new Error('\'renderSectionTitle\' must be implemented. See: https://github.com/moroshko/react-autosuggest#renderSectionTitleProp');
      }
    },
    getSectionSuggestions: (props, propName) => {
      const getSectionSuggestions = props[propName];

      if (props.multiSection === true && typeof getSectionSuggestions !== 'function') {
        throw new Error('\'getSectionSuggestions\' must be implemented. See: https://github.com/moroshko/react-autosuggest#getSectionSuggestionsProp');
      }
    },
    focusInputOnSuggestionClick: PropTypes.bool,
    focusFirstSuggestion: PropTypes.bool,
    theme: PropTypes.object,
    id: PropTypes.string
  };

  static defaultProps = {
    shouldRenderSuggestions: defaultShouldRenderSuggestions,
    alwaysRenderSuggestions: false,
    multiSection: false,
    focusInputOnSuggestionClick: true,
    focusFirstSuggestion: false,
    theme: defaultTheme,
    id: '1'
  };

  constructor({ alwaysRenderSuggestions }) {
    super();

    const initialState = {
      isFocused: false,
      isCollapsed: !alwaysRenderSuggestions,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    };

    this.store = createStore(reducer, initialState);
  }

  storeInputReference = input => {
    this.input = input;
  };

  render() {
    const {
      suggestions, onSuggestionsFetchRequested, onSuggestionsClearRequested,
      multiSection, shouldRenderSuggestions, renderInputComponent,
      renderSuggestionsContainer, getSuggestionValue, renderSuggestion,
      renderSectionTitle, getSectionSuggestions, inputProps, onSuggestionSelected,
      focusInputOnSuggestionClick, focusFirstSuggestion, alwaysRenderSuggestions,
      theme, id
    } = this.props;

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        onSuggestionsClearRequested={onSuggestionsClearRequested}
        multiSection={multiSection}
        shouldRenderSuggestions={alwaysRenderSuggestions ? alwaysTrue : shouldRenderSuggestions}
        alwaysRenderSuggestions={alwaysRenderSuggestions}
        renderInputComponent={renderInputComponent}
        renderSuggestionsContainer={renderSuggestionsContainer}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        renderSectionTitle={renderSectionTitle}
        getSectionSuggestions={getSectionSuggestions}
        inputProps={inputProps}
        onSuggestionSelected={onSuggestionSelected}
        focusInputOnSuggestionClick={focusInputOnSuggestionClick}
        focusFirstSuggestion={focusFirstSuggestion}
        theme={mapToAutowhateverTheme(theme)}
        id={id}
        inputRef={this.storeInputReference}
        store={this.store}
      />
    );
  }
}
