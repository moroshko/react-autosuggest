import {
  clickSuggestion,
  focusAndSetInputValue,
  getSuggestions,
  init,
} from '../helpers';
import TestUtils from 'react-dom/test-utils';
import AutosuggestApp from './AutosuggestApp';
import { expect } from 'chai';
import React from 'react';

describe('Autosuggest with custom shouldKeepSuggestionsOnSelect', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when keep opened for starts with `clo` suggestions', () => {
    it('should keep suggestions on select', () => {
      focusAndSetInputValue('clo');
      clickSuggestion(0);
      const suggestions = getSuggestions();

      expect(suggestions.length).to.equal(1);
    });

    it('should not suggestions on select', () => {
      focusAndSetInputValue('php');
      clickSuggestion(0);
      const suggestions = getSuggestions();

      expect(suggestions.length).to.equal(0);
    });
  });
});
