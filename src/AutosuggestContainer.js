import React, { Component, PropTypes } from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducerAndActions';
import Autosuggest from './Autosuggest';

export default class AutosuggestContainer extends Component {
  static propTypes = {
    suggestions: PropTypes.array.isRequired,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: (props, propName, componentName) => {
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
    theme: PropTypes.object
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
    theme: {
      container: 'react-autosuggest__container',
      'container--open': 'react-autosuggest__container--open',
      input: 'react-autosuggest__input',
      'items-container': 'react-autosuggest__suggestions-container',
      item: 'react-autosuggest__item',
      'item--focused': 'react-autosuggest__item--focused',
      'section-container': 'react-autosuggest__section-container',
      'section-title': 'react-autosuggest__section-title',
      'section-items-container': 'react-autosuggest__section-suggestions-container'
    }
  };

  constructor(props) {
    super(props);

    const { shouldRenderSuggestions, suggestions, inputProps } = props;
    const initialState = {
      isFocused: false,
      isCollapsed: true,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null,
      lastAction: null
    };

    this.store = createStore(reducer, initialState);
  }

  render() {
    const {
      multiSection, shouldRenderSuggestions, suggestions, getSuggestionValue,
      renderSuggestion, renderSectionTitle, getSectionSuggestions, inputProps,
      onSuggestionSelected, theme
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
                     theme={theme} />
      </Provider>
    );
  }
}
