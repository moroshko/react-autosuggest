import React from 'react';
import TestUtils from 'react-addons-test-utils';
import {
  init,
  expectInputValue,
  clickDown,
  clickEnter,
  focusAndSetInputValue
} from '../helpers';
import AutosuggestApp from './AutosuggestApp';

describe('Autosuggest with focusFirstSuggestion={true} and clear on Enter', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when pressing Enter to select a suggestion', () => {
    it('should clear the input after selecting first suggestion', () => {
      focusAndSetInputValue('c');
      clickEnter();
      expectInputValue('');
    });

    it('should clear the input after selecting second suggestion', () => {
      focusAndSetInputValue('c');
      clickDown();
      clickEnter();
      expectInputValue('');
    });
  });

});
