import React, { Component, PropTypes } from 'react';
import reducer from './flux/reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Autosuggest from 'Autosuggest';

export default class AutosuggestContainer extends Component {
  static propTypes = {
    multiSection: PropTypes.bool,
    shouldRenderSuggestions: PropTypes.func,
    suggestions: PropTypes.array.isRequired,
    getSuggestionValue: PropTypes.func.isRequired,
    renderSuggestion: PropTypes.func,
    renderSectionTitle: PropTypes.func,
    getSectionSuggestions: PropTypes.func,
    inputProps: PropTypes.object,
    theme: PropTypes.object
  };

  static defaultProps = {
    multiSection: false,
    shouldRenderSuggestions: value => value.trim().length > 0,
    renderSuggestion() {
      throw new Error('`renderSuggestion` must be provided');
    },
    renderSectionTitle() {
      throw new Error('`renderSectionTitle` must be provided');
    },
    getSectionSuggestions() {
      throw new Error('`getSectionSuggestions` must be provided');
    },
    inputProps: {},
    theme: {
      container: 'react-autosuggest__container',
      input: 'react-autosuggest__input',
      'input--open': 'react-autosuggest__input--open',
      'items-container': 'react-autosuggest__items-container',
      item: 'react-autosuggest__item',
      'item--focused': 'react-autosuggest__item--focused',
      'section-container': 'react-autosuggest__section-container',
      'section-title': 'react-autosuggest__section-title',
      'section-items-container': 'react-autosuggest__section-items-container'
    }
  };

  constructor(props) {
    super(props);

    const { shouldRenderSuggestions, suggestions, inputProps } = props;
    const initialState = {
      isOpen: shouldRenderSuggestions(inputProps.value) && suggestions.length > 0,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null
    };

    this.store = createStore(reducer, initialState);
  }

  render() {
    const { multiSection, shouldRenderSuggestions, suggestions,
            getSuggestionValue, renderSuggestion, renderSectionTitle,
            getSectionSuggestions, inputProps, theme } = this.props;

    return (
      <Provider store={this.store}>
        {
          () => <Autosuggest multiSection={multiSection}
                             shouldRenderSuggestions={shouldRenderSuggestions}
                             suggestions={suggestions}
                             getSuggestionValue={getSuggestionValue}
                             renderSuggestion={renderSuggestion}
                             renderSectionTitle={renderSectionTitle}
                             getSectionSuggestions={getSectionSuggestions}
                             inputProps={inputProps}
                             theme={theme} />
        }
      </Provider>
    );
  }
}
