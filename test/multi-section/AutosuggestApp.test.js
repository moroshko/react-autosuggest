import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import {
  init,
  getInnerHTML,
  expectContainerAttribute,
  expectInputAttribute,
  expectSuggestionsContainerAttribute,
  getTitle,
//  getSuggestionsBySectionIndex,
  clickSuggestion,
  clickEscape,
  focusAndSetInputValue,
  isInputFocused
} from '../helpers';
import AutosuggestApp, {
  renderSectionTitle,
  getSectionSuggestions
} from './AutosuggestApp';

describe('Multi section Autosuggest', () => {
  beforeEach(() => {
    const app = TestUtils.renderIntoDocument(React.createElement(AutosuggestApp));
    const container = TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__container');
    const input = TestUtils.findRenderedDOMComponentWithTag(app, 'input');

    init({ app, container, input });
  });

  describe('when suggestion is clicked', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      clickSuggestion(1);
    });

    it('should not focus on input if focusInputOnSuggestionClick is false', () => {
      expect(isInputFocused()).to.equal(false);
    });
  });

  describe('renderSectionTitle', () => {
    beforeEach(() => {
      renderSectionTitle.reset();
      focusAndSetInputValue('c');
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
      getSectionSuggestions.reset();
      focusAndSetInputValue('j');
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

/*  See: https://github.com/facebook/react/issues/4692#issuecomment-157803622

    it('return value should be used to render section suggestions', () => {
      const firstSectionSuggestions = getSuggestionsBySectionIndex(0);

      expect(firstSectionSuggestions.length).to.equal(2);
    });
*/
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
      expectSuggestionsContainerAttribute('class', 'react-autosuggest__suggestions-container');
    });
  });
});
