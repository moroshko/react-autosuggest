import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { init, expectInputComponent } from '../helpers';
import AutosuggestApp from './AutosuggestApp';
import CustomInput from './CustomInput';

describe('Autosuggest with inputComponent', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('initially', () => {
    it('should render the custom input component', () => {
      expectInputComponent(CustomInput);
    });
  });
});
