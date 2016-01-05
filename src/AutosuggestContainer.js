import React, { Component, PropTypes } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducerAndActions';
import Autosuggest from './Autosuggest';

const defaultTheme = {
  container: 'react-autosuggest__container',
  containerOpen: 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  suggestionsContainer: 'react-autosuggest__suggestions-container',
  suggestion: 'react-autosuggest__suggestion',
  suggestionFocused: 'react-autosuggest__suggestion--focused',
  sectionContainer: 'react-autosuggest__section-container',
  sectionTitle: 'react-autosuggest__section-title',
  sectionSuggestionsContainer: 'react-autosuggest__section-suggestions-container'
};

function mapToAutowhateverTheme(theme) {
  var result = {};

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

      case 'sectionSuggestionsContainer':
        result['sectionItemsContainer'] = theme[key];
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
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: (props, propName) => {
      const inputProps = props[propName];

      if (!('value' in inputProps)) {
        throw new Error('\'inputProps\' must have \'value\'.');
      }

      if (!('onChange' in inputProps)) {
        throw new Error('\'inputProps\' must have \'onChange\'.');
      }
    },
    shouldRenderSuggestions: PropTypes.func,
    onSuggestionSelected: PropTypes.func,
    multiSection: PropTypes.bool,
    renderSectionTitle: PropTypes.func,
    getSectionSuggestions: PropTypes.func,
    focusInputOnSuggestionClick: PropTypes.bool,
    theme: PropTypes.object,
    id: PropTypes.string
  };

  static defaultProps = {
    shouldRenderSuggestions: value => value.trim().length > 0,
    onSuggestionSelected: () => {},
    multiSection: false,
    renderSectionTitle() {
      throw new Error('`renderSectionTitle` must be provided');
    },
    getSectionSuggestions() {
      throw new Error('`getSectionSuggestions` must be provided');
    },
    focusInputOnSuggestionClick: true,
    theme: defaultTheme,
    id: '1'
  };

  constructor(props) {
    super(props);

    const initialState = {
      isFocused: false,
      isCollapsed: true,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null,
      lastAction: null
    };

    this.store = createStore(reducer, initialState);
    this.theme = mapToAutowhateverTheme(this.props.theme);
  }

  render() {
    const {
      multiSection, shouldRenderSuggestions, suggestions, getSuggestionValue,
      renderSuggestion, renderSectionTitle, getSectionSuggestions, inputProps,
      onSuggestionSelected, focusInputOnSuggestionClick, id
    } = this.props;

    return (
      <Provider store={this.store}>
        <Autosuggest multiSection={multiSection}
                     shouldRenderSuggestions={shouldRenderSuggestions}
                     suggestions={suggestions}
                     getSuggestionValue={getSuggestionValue}
                     renderSuggestion={renderSuggestion}
                     renderSectionTitle={renderSectionTitle}
                     getSectionSuggestions={getSectionSuggestions}
                     inputProps={inputProps}
                     onSuggestionSelected={onSuggestionSelected}
                     focusInputOnSuggestionClick={focusInputOnSuggestionClick}
                     theme={this.theme}
                     id={id} />
      </Provider>
    );
  }
}
