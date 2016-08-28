import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import {
  init,
  syntheticEventMatcher,
  getInnerHTML,
  expectContainerAttribute,
  expectInputAttribute,
  expectSuggestions,
  expectFocusedSuggestion,
  getSuggestionsContainerAttribute,
  getTitle,
  clickSuggestion,
  focusInput,
  clickEscape,
  clickEnter,
  clickDown,
  setInputValue,
  focusAndSetInputValue,
  clickClearButton
} from '../helpers';
import AutosuggestApp, {
  onSuggestionsFetchRequested,
  onSuggestionSelected,
  renderSectionTitle,
  getSectionSuggestions,
  setFocusFirstSuggestion
} from './AutosuggestApp';

describe('Autosuggest with multiSection={true}', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('shouldRenderSuggestions', () => {
    it('should show suggestions input is empty and true is returned', () => {
      focusInput();
      expectSuggestions([
        'C', 'C#', 'C++', 'Clojure', 'Elm', 'Go', 'Haskell', 'Java',
        'Javascript', 'Perl', 'PHP', 'Python', 'Ruby', 'Scala'
      ]);
    });
  });

  describe('onSuggestionSelected', () => {
    beforeEach(() => {
      onSuggestionSelected.reset();
      focusInput();
    });

    it('should be called with the right sectionIndex when suggestion is clicked', () => {
      clickSuggestion(4);
      expect(onSuggestionSelected).to.have.been.calledWith(syntheticEventMatcher, sinon.match({
        sectionIndex: 1
      }));
    });

    it('should be called with the right sectionIndex when Enter is pressed and suggestion is focused', () => {
      clickDown(6);
      clickEnter();
      expect(onSuggestionSelected).to.have.been.calledWith(syntheticEventMatcher, sinon.match({
        sectionIndex: 2
      }));
    });
  });

  describe('onSuggestionsFetchRequested', () => {
    it('should be called once with the right parameters when input gets focus and shouldRenderSuggestions returns true', () => {
      onSuggestionsFetchRequested.reset();
      focusInput();
      expect(onSuggestionsFetchRequested).to.have.been.calledOnce;
      expect(onSuggestionsFetchRequested).to.have.been.calledWithExactly({ value: '' });
    });

    it('should be called once with the right parameters when Escape is pressed and suggestions are hidden and shouldRenderSuggestions returns true for empty value', () => {
      focusAndSetInputValue('jr');
      onSuggestionsFetchRequested.reset();
      clickEscape();
      expect(onSuggestionsFetchRequested).to.have.been.calledOnce;
      expect(onSuggestionsFetchRequested).to.have.been.calledWithExactly({ value: '' });
    });
  });

  describe('when input is cleared after suggestion is clicked', () => {
    beforeEach(() => {
      focusInput();
      clickSuggestion(1);
    });

    it('should show suggestions', () => {
      clickClearButton();
      expectSuggestions([
        'C', 'C#', 'C++', 'Clojure', 'Elm', 'Go', 'Haskell', 'Java',
        'Javascript', 'Perl', 'PHP', 'Python', 'Ruby', 'Scala'
      ]);
    });
  });

  describe('renderSectionTitle', () => {
    beforeEach(() => {
      focusInput();
      renderSectionTitle.reset();
      setInputValue('c');
    });

    it('should be called with the right parameters', () => {
      expect(renderSectionTitle).to.have.been.calledWithExactly({
        title: 'C',
        languages: [
          {
            name: 'C',
            year: 1972
          },
          {
            name: 'C#',
            year: 2000
          },
          {
            name: 'C++',
            year: 1983
          },
          {
            name: 'Clojure',
            year: 2007
          }
        ]
      });
    });

    it('should be called once per section', () => {
      expect(renderSectionTitle).to.have.been.calledOnce;
    });

    it('return value should be used to render titles', () => {
      const firstTitle = getTitle(0);

      expect(getInnerHTML(firstTitle)).to.equal('<strong>C</strong>');
    });
  });

  describe('getSectionSuggestions', () => {
    beforeEach(() => {
      focusInput();
      getSectionSuggestions.reset();
      setInputValue('j');
    });

    it('should be called with the right parameters', () => {
      expect(getSectionSuggestions).to.have.been.calledWithExactly({
        title: 'J',
        languages: [
          {
            name: 'Java',
            year: 1995
          },
          {
            name: 'Javascript',
            year: 1995
          }
        ]
      });
    });

    it('should be called once per section', () => {
      expect(getSectionSuggestions).to.have.been.calledOnce;
    });
  });

  describe('default styling', () => {
    it('should set input class', () => {
      expectInputAttribute('class', 'react-autosuggest__input');
    });

    it('should add open container class when suggestions are shown', () => {
      focusAndSetInputValue('c');
      expectContainerAttribute('class', 'react-autosuggest__container react-autosuggest__container--open');
    });

    it('should remove open container class when suggestions are hidden', () => {
      focusAndSetInputValue('c');
      clickEscape();
      expectContainerAttribute('class', 'react-autosuggest__container');
    });

    it('should set suggestions container class', () => {
      focusAndSetInputValue('e');
      expect(getSuggestionsContainerAttribute('class')).to.equal('react-autosuggest__suggestions-container');
    });
  });

  describe('and focusFirstSuggestion={true}', () => {
    before(() => {
      setFocusFirstSuggestion(true);
    });

    after(() => {
      setFocusFirstSuggestion(false);
    });

    describe('when typing and matches exist', () => {
      beforeEach(() => {
        focusAndSetInputValue('p');
      });

      it('should focus on the first suggestion', () => {
        expectFocusedSuggestion('Perl');
      });
    });
  });
});
