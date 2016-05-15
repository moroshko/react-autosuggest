import React, { Component } from 'react';
import sinon from 'sinon';
import Autosuggest from '../../src/AutosuggestContainer';
import options from './options';
import { addEvent } from '../helpers';

let app = null;

export const getSuggestionValue = sinon.spy(suggestion => suggestion);

export const renderSuggestion = sinon.spy((suggestion, { value }) =>
  suggestion === value ? <div>{suggestion.label}</div> : <span>{suggestion.label}</span>
);

export const renderInput = sinon.spy((inputProps) => <div {...inputProps}>{inputProps.value.label}</div>);

export const onChange = sinon.spy((event, { newValue }) => {
  addEvent('onChange');

  app.setState({
    displayValue: newValue
  });
});

export const onBlur = sinon.spy(() => app.setState({ displayValue: null }));

export const onSuggestionSelected = sinon.spy((event, { suggestion }) => {
  addEvent('onSuggestionSelected');

  app.setState({
    value: suggestion,
    displayValue: null
  });
});

export const shouldRenderSuggestions = sinon.spy(() => true);

export default class AutosuggestApp extends Component {
  constructor() {
    super();

    app = this;

    this.state = {
      value: options[0],
      displayValue: null
    };
  }

  render() {
    const { value, displayValue } = this.state;
    const inputProps = {
      id: 'my-awesome-autosuggest',
      tabIndex: 0,
      autoComplete: null,
      type: null,
      value: (displayValue || value),
      onChange,
      onBlur
    };

    return (
      <Autosuggest suggestions={options}
                   shouldRenderSuggestions={shouldRenderSuggestions}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   renderInput={renderInput}
                   onSuggestionSelected={onSuggestionSelected}
                   inputProps={inputProps}
                   wrapItemFocus={false}
                   blurOnSuggestionSelect={true}
                   focusInputOnSuggestionClick={false} />
    );
  }
}
