import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  setInputValue,
  isInputFocused,
  focusInputNatively,
  expectSuggestions
} from '../helpers';
import AutosuggestApp from './AutosuggestApp';

describe('Autosuggest with default focused input', () => {
  it('should show suggestions for autoFocus html attribute', () => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp autoFocus={true} />));
    setInputValue('C');
    expectSuggestions(['C', 'C#', 'C++', 'Clojure']);
    expect(isInputFocused()).to.equal(true);
  });

  it('should show suggestions for native focus on input', () => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
    focusInputNatively();
    setInputValue('C');
    expectSuggestions(['C', 'C#', 'C++', 'Clojure']);
    expect(isInputFocused()).to.equal(true);
  });
});
