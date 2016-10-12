import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/AutosuggestContainer';
import CustomInput from './CustomInput';
let app = null;

export const onChange = sinon.spy((event, { newValue }) => {
  app.setState({
    value: newValue
  });
});

const onSuggestionsFetchRequested = () => {};
const getSuggestionValue = () => 'value';
const renderSuggestion = () => <span>test</span>;

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: '',
      suggestions: []
    };
  }

  render() {
    const { value, suggestions } = this.state;
    const inputProps = {
      value,
      onChange
    };

    return (
      <Autosuggest
        suggestions={suggestions}
        onSuggestionsFetchRequested={onSuggestionsFetchRequested}
        getSuggestionValue={getSuggestionValue}
        renderSuggestion={renderSuggestion}
        inputProps={inputProps}
        inputElement={CustomInput}
        alwaysRenderSuggestions={true} />
    );
  }
}
