import React, { Component, PropTypes } from 'react';
import reducer from './flux/reducer';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Autosuggest from 'Autosuggest';

export default class AutosuggestContainer extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    const { items, renderItem, inputProps, theme } = props;
    const initialState = { items, renderItem, inputProps, theme };

    this.store = createStore(reducer, initialState);
  }

  render() {
    return (
      <Provider store={this.store}>
        {() => <Autosuggest />}
      </Provider>
    );
  }
}
