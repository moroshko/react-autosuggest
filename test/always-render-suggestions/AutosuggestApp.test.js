import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  expectInputValue,
  expectSuggestions,
  expectHighlightedSuggestion,
  clickSuggestion,
  focusInput,
  blurInput,
  clickEscape,
  clickEnter,
  clickCombinedCharacterEnter,
  clickDown,
  clickUp,
  focusAndSetInputValue
} from '../helpers';
import AutosuggestApp, { onSuggestionsFetchRequested } from './AutosuggestApp';

const allSuggestions = [
  'C',
  'C#',
  'C++',
  'Clojure',
  'Elm',
  'Go',
  'Haskell',
  'Java',
  'JavaScript',
  'Perl',
  'PHP',
  'Python',
  'Ruby',
  'Scala'
];

describe('Autosuggest with alwaysRenderSuggestions={true}', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('initially', () => {
    it('should render suggestions', () => {
      expectSuggestions(allSuggestions);
    });
  });

  describe('when empty input is focused', () => {
    it('should render suggestions', () => {
      focusInput();
      expectSuggestions(allSuggestions);
    });
  });

  describe('when empty input is blurred', () => {
    it('should render suggestions', () => {
      focusInput();
      blurInput();
      expectSuggestions(allSuggestions);
    });
  });

  describe('when typing and matches exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('e');
    });

    it('should render suggestions', () => {
      expectSuggestions(['Elm']);
    });

    it('should render suggestions when input is blurred', () => {
      blurInput();
      expectSuggestions(['Elm']);
    });
  });

  describe('when pressing Down', () => {
    it('should highlight the first suggestion', () => {
      focusAndSetInputValue('p');
      clickDown();
      expectHighlightedSuggestion('Perl');
    });
  });

  describe('when pressing Up', () => {
    it('should highlight the last suggestion', () => {
      focusAndSetInputValue('p');
      clickUp();
      expectHighlightedSuggestion('Python');
    });
  });

  describe('when pressing Enter', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should update suggestions if there is a highlighted suggestion', () => {
      clickDown();
      clickEnter();
      expectSuggestions(['Perl']);
    });

    it('should not hide suggestions if there is no highlighted suggestion', () => {
      clickEnter();
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });

    it('should not hide suggestions if enter event for combined character', () => {
      clickCombinedCharacterEnter();
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });
  });

  describe('when pressing Escape', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    describe('without prior Up/Down interaction', () => {
      it('should clear the input', () => {
        clickEscape();
        expectInputValue('');
      });
    });

    describe('after Up/Down interaction', () => {
      beforeEach(() => {
        clickDown();
        clickEscape();
      });

      it('should revert input value', () => {
        expectInputValue('p');
      });

      it('should reset the highlighted suggestion', () => {
        expectHighlightedSuggestion(null);
      });

      it('should clear the input when Escape is pressed again', () => {
        clickEscape();
        expectInputValue('');
      });
    });
  });

  describe('when suggestion is clicked', () => {
    it('should not hide suggestions', () => {
      focusAndSetInputValue('p');
      clickSuggestion(1);
      expectSuggestions(['PHP']);
    });

    it('should reset the highlighted suggestion', () => {
      focusAndSetInputValue('j');
      clickSuggestion(1);
      clickDown();
      expectHighlightedSuggestion('JavaScript');
    });
  });

  describe('onSuggestionsFetchRequested', () => {
    it('should be called once with the right parameters when suggestion is selected', () => {
      focusAndSetInputValue('j');
      onSuggestionsFetchRequested.resetHistory();
      clickSuggestion(1);
      expect(onSuggestionsFetchRequested).to.have.been.calledOnce;
      expect(onSuggestionsFetchRequested).to.have.been.calledWithExactly({
        value: 'JavaScript',
        reason: 'suggestion-selected'
      });
    });
  });
});
