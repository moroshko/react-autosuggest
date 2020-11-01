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
  clickEnter,
  clickDown,
  setInputValue,
  focusAndSetInputValue,
} from '../helpers';
import AutosuggestApp, {
  onChange,
  onSuggestionSelected,
  onSuggestionHighlighted,
  getHighlightFirstSuggestion,
} from './AutosuggestApp';

describe('Autosuggest with highlightFirstSuggestion={true}', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when highlightFirstSuggestion changes from true to false', () => {
    it('should not have highlighted suggestions', () => {
      focusAndSetInputValue('j');
      getHighlightFirstSuggestion(true, 'j');
      expectHighlightedSuggestion('Java');
      focusAndSetInputValue('');
      getHighlightFirstSuggestion(false, '');
      expectHighlightedSuggestion(null);
    });
  });

  describe('when typing and matches exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('j');
      getHighlightFirstSuggestion(true, 'j');
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
      clickEnter();
      expectSuggestions([]);
    });

    it('should hide suggestions if mouse entered another suggestion after autohighlight', () => {
      focusAndSetInputValue('p');
      mouseEnterSuggestion(2);
      clickEnter();
      expectSuggestions([]);
    });

    it('should not error if there are no suggestions', () => {
      focusAndSetInputValue('z');
      clickEnter();
      expectInputValue('z');
    });
  });

  describe('inputProps.onChange', () => {
    it('should be called once with the right parameters when Enter is pressed after autohighlight', () => {
      focusAndSetInputValue('p');
      onChange.resetHistory();
      clickEnter();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWith(syntheticEventMatcher, {
        newValue: 'Perl',
        method: 'enter',
      });
    });
  });

  describe('onSuggestionSelected', () => {
    it('should be called once with the right parameters when Enter is pressed after autohighlight', () => {
      focusAndSetInputValue('p');
      onSuggestionSelected.resetHistory();
      clickEnter();
      expect(onSuggestionSelected).to.have.been.calledOnce;
      expect(onSuggestionSelected).to.have.been.calledWithExactly(
        syntheticEventMatcher,
        {
          suggestion: { name: 'Perl', year: 1987 },
          suggestionValue: 'Perl',
          suggestionIndex: 0,
          sectionIndex: null,
          method: 'enter',
        }
      );
    });
  });

  describe('onSuggestionHighlighted', () => {
    it('should be called once with the highlighed suggestion when the first suggestion is autohighlighted', () => {
      onSuggestionHighlighted.resetHistory();
      focusAndSetInputValue('p');
      expect(onSuggestionHighlighted).to.have.been.calledOnce;
      expect(onSuggestionHighlighted).to.have.been.calledWithExactly({
        suggestion: { name: 'Perl', year: 1987 },
      });
    });

    it('should be called once with the new suggestion when typing more changes the autohighlighted suggestion', () => {
      focusAndSetInputValue('c');
      onSuggestionHighlighted.resetHistory();
      focusAndSetInputValue('c+');
      expect(onSuggestionHighlighted).to.have.been.calledOnce;
      expect(onSuggestionHighlighted).to.have.been.calledWithExactly({
        suggestion: { name: 'C++', year: 1983 },
      });
    });
  });
});
