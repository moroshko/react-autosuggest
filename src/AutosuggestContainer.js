import React, { Component, PropTypes } from 'react';
import { createStore } from 'redux';
import reducer from './redux';
import Autosuggest from './Autosuggest';

const noop = () => {};
const alwaysTrue = () => true;

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

function mapToAutowhateverTheme(theme) {
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
}

export default class AutosuggestContainer extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    renderSuggestionsContainer: PropTypes.func,
    onSuggestionsUpdateRequested: PropTypes.func,
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
    onSuggestionSelected: PropTypes.func,
    multiSection: PropTypes.bool,
    renderSectionTitle: PropTypes.func,
    getSectionSuggestions: PropTypes.func,
    focusInputOnSuggestionClick: PropTypes.bool,
    focusFirstSuggestion: PropTypes.bool,
    theme: PropTypes.object,
    id: PropTypes.string
  };

  static defaultProps = {
    onSuggestionsUpdateRequested: noop,
    shouldRenderSuggestions: value => value.trim().length > 0,
    alwaysRenderSuggestions: false,
    onSuggestionSelected: noop,
    multiSection: false,
    renderSectionTitle() {
      throw new Error('`renderSectionTitle` must be provided');
    },
    getSectionSuggestions() {
      throw new Error('`getSectionSuggestions` must be provided');
    },
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
      valueBeforeUpDown: null,
      lastAction: null
    };

    this.store = createStore(reducer, initialState);
  }

  storeInputReference = input => {
    this.input = input;
  };

  render() {
    const {
      multiSection, shouldRenderSuggestions, suggestions, renderSuggestionsContainer,
      onSuggestionsUpdateRequested, getSuggestionValue, renderSuggestion,
      renderSectionTitle, getSectionSuggestions, inputProps,
      onSuggestionSelected, focusInputOnSuggestionClick, focusFirstSuggestion,
      alwaysRenderSuggestions, theme, id
    } = this.props;

    return (
      <Autosuggest
        multiSection={multiSection}
        shouldRenderSuggestions={alwaysRenderSuggestions ? alwaysTrue : shouldRenderSuggestions}
        alwaysRenderSuggestions={alwaysRenderSuggestions}
        suggestions={suggestions}
        renderSuggestionsContainer={renderSuggestionsContainer}
        onSuggestionsUpdateRequested={onSuggestionsUpdateRequested}
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
        store={this.store} />
    );
  }
}
