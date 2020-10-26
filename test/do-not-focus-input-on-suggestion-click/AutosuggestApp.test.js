import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  syntheticEventMatcher,
  clickSuggestion,
  focusAndSetInputValue,
  isInputFocused,
  mouseUpDocument
} from '../helpers';
import AutosuggestApp, {
  onBlur,
  onSuggestionsClearRequested
} from './AutosuggestApp';

describe('Autosuggest with focusInputOnSuggestionClick={false}', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when suggestion is clicked', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      onBlur.resetHistory();
      onSuggestionsClearRequested.resetHistory();
      clickSuggestion(1);
    });

    it('should not focus on input', () => {
      expect(isInputFocused()).to.equal(false);
    });

    it('should call onBlur once with the right parameters', () => {
      expect(onBlur).to.have.been.calledOnce;
      expect(onBlur).to.have.been.calledWithExactly(syntheticEventMatcher, {
        highlightedSuggestion: { name: 'PHP', year: 1995 }
      });
    });

    it('should call onSuggestionsClearRequested once', () => {
      expect(onSuggestionsClearRequested).to.have.been.calledOnce;
    });

    it('should not focus input on document mouse up', () => {
      mouseUpDocument();
      expect(isInputFocused()).to.equal(false);
    });
  });
});
