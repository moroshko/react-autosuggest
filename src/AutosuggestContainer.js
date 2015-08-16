import React, { Component, PropTypes } from 'react';
import reducer from './flux/reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Autosuggest from 'Autosuggest';

export default class AutosuggestContainer extends Component {
  static propTypes = {
    shouldRenderSuggestions: PropTypes.func,
    suggestions: PropTypes.array.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };

  static defaultProps = {
    shouldRenderSuggestions: value => value.trim().length > 0
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
    const { shouldRenderSuggestions, suggestions,
            renderSuggestion, inputProps, theme } = this.props;

    return (
      <Provider store={this.store}>
        {
          () => <Autosuggest shouldRenderSuggestions={shouldRenderSuggestions}
                             suggestions={suggestions}
                             renderSuggestion={renderSuggestion}
                             inputProps={inputProps}
                             theme={theme} />
        }
      </Provider>
    );
  }
}
