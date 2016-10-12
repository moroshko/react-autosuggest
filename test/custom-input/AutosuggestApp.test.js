import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {
  init,
  expectInputElement
} from '../helpers';
import AutosuggestApp from './AutosuggestApp';
import CustomInput from './CustomInput';

describe('Autosuggest with inputElement', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('initially', () => {
    it('should render the inputElement', () => {
      expectInputElement(CustomInput);
    });
  });
});
