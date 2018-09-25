import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  syntheticEventMatcher,
  expectInputValue,
  expectSuggestions,
  expectHighlightedSuggestion,
  mouseEnterSuggestion,
  mouseLeaveSuggestion,
  focusInput,
  blurInput,
  clickEscape,
  clickTab,
  clickDown,
  setInputValue,
  focusAndSetInputValue
} from '../helpers';
import AutosuggestApp, {
  onChange,
  onSuggestionSelected,
  onSuggestionHighlighted
} from './AutosuggestApp';

describe('Autosuggest with highlightFirstSuggestion={true} and selectOnTab={true}', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when typing and matches exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('j');
    });

    it('should highlight the first suggestion', () => {
      expectHighlightedSuggestion('Java');
    });

    it('should highlight the first suggestion when typing a character does not change the suggestions', () => {
      focusAndSetInputValue('ja');
      expectHighlightedSuggestion('Java');
    });

    it('should highlight the first suggestion when input is focused after it has been blurred', () => {
      blurInput();
      focusInput();
      expectHighlightedSuggestion('Java');
    });

    it('should highlight the first suggestion when same suggestions are shown again', () => {
      setInputValue('');
      setInputValue('j');
      expectHighlightedSuggestion('Java');
    });

    it('should highlight a suggestion when mouse enters it', () => {
      mouseEnterSuggestion(1);
      expectHighlightedSuggestion('JavaScript');
    });

    it('should not have highlighted suggestions when mouse leaves a suggestion', () => {
      mouseEnterSuggestion(1);
      mouseLeaveSuggestion(1);
      expectHighlightedSuggestion(null);
    });
  });

  describe('when pressing Down', () => {
    beforeEach(() => {
      focusAndSetInputValue('j');
    });

    it('should highlight the second suggestion', () => {
      clickDown();
      expectHighlightedSuggestion('JavaScript');
    });

    it('should not highlight any suggestion after reaching the last suggestion', () => {
      clickDown(2);
      expectHighlightedSuggestion(null);
    });

    it('should highlight the first suggestion when suggestions are revealed', () => {
      clickEscape();
      clickDown();
      expectHighlightedSuggestion('Java');
    });
  });

  describe('when pressing Enter', () => {
    it('should hide suggestions if the first suggestion was autohighlighted', () => {
      focusAndSetInputValue('p');
      clickTab();
      expectSuggestions([]);
    });

    it('should hide suggestions if mouse entered another suggestion after autohighlight', () => {
      focusAndSetInputValue('p');
      mouseEnterSuggestion(2);
      clickTab();
      expectSuggestions([]);
    });

    it('should not error if there are no suggestions', () => {
      focusAndSetInputValue('z');
      clickTab();
      expectInputValue('z');
    });
  });

  describe('inputProps.onChange', () => {
    it('should be called once with the right parameters when Enter is pressed after autohighlight', () => {
      focusAndSetInputValue('p');
      onChange.reset();
      clickTab();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWith(syntheticEventMatcher, {
        newValue: 'Perl',
        method: 'enter'
      });
    });
  });

  describe('onSuggestionSelected', () => {
    it('should be called once with the right parameters when Enter is pressed after autohighlight', () => {
      focusAndSetInputValue('p');
      onSuggestionSelected.reset();
      clickTab();
      expect(onSuggestionSelected).to.have.been.calledOnce;
      expect(
        onSuggestionSelected
      ).to.have.been.calledWithExactly(syntheticEventMatcher, {
        suggestion: { name: 'Perl', year: 1987 },
        suggestionValue: 'Perl',
        suggestionIndex: 0,
        sectionIndex: null,
        method: 'enter'
      });
    });
  });

  describe('onSuggestionHighlighted', () => {
    it('should be called once with the highlighed suggestion when the first suggestion is autohighlighted', () => {
      onSuggestionHighlighted.reset();
      focusAndSetInputValue('p');
      expect(onSuggestionHighlighted).to.have.been.calledOnce;
      expect(onSuggestionHighlighted).to.have.been.calledWithExactly({
        suggestion: { name: 'Perl', year: 1987 }
      });
    });
  });
});
