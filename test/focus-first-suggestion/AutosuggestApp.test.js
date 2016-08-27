import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import {
  init,
  syntheticEventMatcher,
  expectInputValue,
  expectSuggestions,
  expectFocusedSuggestion,
  mouseEnterSuggestion,
  mouseLeaveSuggestion,
  focusInput,
  blurInput,
  clickEscape,
  clickEnter,
  clickDown,
  setInputValue,
  focusAndSetInputValue
} from '../helpers';
import AutosuggestApp, {
  onChange,
  onSuggestionSelected
} from './AutosuggestApp';

describe('Autosuggest with focusFirstSuggestion={true}', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when typing and matches exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('j');
    });

    it('should focus on the first suggestion', () => {
      expectFocusedSuggestion('Java');
    });

    it('should focus on the first suggestion when typing a character does not change the suggestions', () => {
      focusAndSetInputValue('ja');
      expectFocusedSuggestion('Java');
    });

    it('should focus on the first suggestion when input is focused after it has been blurred', () => {
      blurInput();
      focusInput();
      expectFocusedSuggestion('Java');
    });

    it('should focus on the first suggestion when same suggestions are shown again', () => {
      setInputValue('');
      setInputValue('j');
      expectFocusedSuggestion('Java');
    });

    it('should focus on suggestion when mouse enters it', () => {
      mouseEnterSuggestion(1);
      expectFocusedSuggestion('Javascript');
    });

    it('should not have focused suggestions when mouse leaves a suggestion', () => {
      mouseEnterSuggestion(1);
      mouseLeaveSuggestion(1);
      expectFocusedSuggestion(null);
    });
  });

  describe('when pressing Down', () => {
    beforeEach(() => {
      focusAndSetInputValue('j');
    });

    it('should focus on the second suggestion', () => {
      clickDown();
      expectFocusedSuggestion('Javascript');
    });

    it('should not focus on any suggestion after reaching the last suggestion', () => {
      clickDown(2);
      expectFocusedSuggestion(null);
    });

    it('should focus on the first suggestion when suggestions are revealed', () => {
      clickEscape();
      clickDown();
      expectFocusedSuggestion('Java');
    });
  });

  describe('when pressing Enter', () => {
    it('should hide suggestions if the first suggestion was autofocused', () => {
      focusAndSetInputValue('p');
      clickEnter();
      expectSuggestions([]);
    });

    it('should hide suggestions if mouse entered another suggestion after autofocus', () => {
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
    beforeEach(() => {
      focusAndSetInputValue('p');
      onChange.reset();
    });

    it('should be called once with the right parameters when Enter is pressed after autofocus', () => {
      clickEnter();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWith(syntheticEventMatcher, {
        newValue: 'Perl',
        method: 'enter'
      });
    });
  });

  describe('onSuggestionSelected', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      onSuggestionSelected.reset();
    });

    it('should be called once with the right parameters when Enter is pressed after autofocus', () => {
      clickEnter();
      expect(onSuggestionSelected).to.have.been.calledOnce;
      expect(onSuggestionSelected).to.have.been.calledWithExactly(syntheticEventMatcher, {
        suggestion: { name: 'Perl', year: 1987 },
        suggestionValue: 'Perl',
        sectionIndex: null,
        method: 'enter'
      });
    });
  });
});
