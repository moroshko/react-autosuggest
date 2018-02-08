import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  expectInputValue,
  clickTab,
  clickDown,
  focusAndSetInputValue,
  clearEvents,
  getEvents
} from '../helpers';
import AutosuggestApp, {
  onChange,
  onSuggestionSelected
} from './AutosuggestApp';

describe('Autosuggest with highlightFirstSuggestion={true} and selectOnTab={true} clear on Tab', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when pressing Tab', () => {
    beforeEach(() => {
      focusAndSetInputValue('c');
    });

    it('should clear the input after selecting the first suggestion', () => {
      clickTab();
      expectInputValue('');
    });

    it('should clear the input after selecting the second suggestion', () => {
      clickDown();
      clickTab();
      expectInputValue('');
    });
  });

  describe('onSuggestionSelected', () => {
    beforeEach(() => {
      onSuggestionSelected.reset();
      focusAndSetInputValue('j');
    });

    it('should be called after inputProps.onChange when Tab is pressed', () => {
      onChange.reset();
      clearEvents();
      clickTab();
      expect(getEvents()).to.deep.equal(['onChange', 'onSuggestionSelected']);
    });
  });
});
