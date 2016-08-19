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
  focusInput,
  blurInput,
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
      focusAndSetInputValue('p');
    });

    it('should focus on the first suggestion', () => {
      expectFocusedSuggestion('Perl');
    });

    it('should focus on the first suggestion when input is focused after it has been blurred', () => {
      blurInput();
      focusInput();
      expectFocusedSuggestion('Perl');
    });

    it('should focus on the first suggestion when same suggestions are shown again', () => {
      setInputValue('');
      setInputValue('p');
      expectFocusedSuggestion('Perl');
    });
  });

  describe('when pressing Down', () => {
    it('should focus on the second suggestion', () => {
      focusAndSetInputValue('c');
      clickDown();
      expectFocusedSuggestion('C#');
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
