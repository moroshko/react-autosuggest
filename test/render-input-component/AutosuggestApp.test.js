import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { init, expectInputReferenceToBeSet } from '../helpers';
import AutosuggestApp from './AutosuggestApp';

describe('Autosuggest with renderInputComponent', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('initially', () => {
    it('should set the input reference', () => {
      expectInputReferenceToBeSet();
    });
  });
});
