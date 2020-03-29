import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  expectInputValue,
  clickEnter,
  clickDown,
  focusAndSetInputValue,
  clearEvents,
  getEvents
} from '../helpers';
import AutosuggestApp, {
  onChange,
  onSuggestionSelected
} from './AutosuggestApp';

describe('Autosuggest with highlightFirstSuggestion={true} and clear on Enter', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when pressing Enter', () => {
    beforeEach(() => {
      focusAndSetInputValue('c');
    });

    it('should clear the input after selecting the first suggestion', () => {
      clickEnter();
      expectInputValue('');
    });

    it('should clear the input after selecting the second suggestion', () => {
      clickDown();
      clickEnter();
      expectInputValue('');
    });
  });

  describe('onSuggestionSelected', () => {
    beforeEach(() => {
      onSuggestionSelected.resetHistory();
      focusAndSetInputValue('j');
    });

    it('should be called after inputProps.onChange when Enter is pressed', () => {
      onChange.resetHistory();
      clearEvents();
      clickEnter();
      expect(getEvents()).to.deep.equal(['onChange', 'onSuggestionSelected']);
    });
  });
});
