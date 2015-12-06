import React, { Component } from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import Autosuggest from '../src/AutosuggestContainer';
import languages from './languages';

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

class App extends Component {
  constructor() {
    super();

    this.state = {
      value: ''
    };

    // do we need bind(this)?
  }

  onChange(event, newValue) {
    this.setState({
      value: newValue
    });
  }

  render() {
    const inputProps = {
      value: this.state.value,
      onChange: this.onChange
    };

    return (
      <Autosuggest suggestions={languages}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps} />
    );
  }
}

describe('Autosuggest', () => {
  beforeEach(() => {
    const app = TestUtils.renderIntoDocument(React.createElement(App));
  });

  it('todo', () => {
    expect('write tests').to.have.length(11);
  });
});
