import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  getInnerHTML,
  getElementWithClass,
  setInputValue
} from '../helpers';
import AutosuggestApp from './AutosuggestApp';

describe('Autosuggest receiving null in this.state.value', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  it('should convert null to an empty string in order to avoid TypeErrors', () => {
    setInputValue(null);
    expect(getInnerHTML(getElementWithClass('my-query'))).to.equal('');
  });
});
