import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import {
  init,
  getInnerHTML,
  getTitle,
  getSuggestionsBySectionIndex,
  focusAndSetInputValue
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

  describe('renderSectionTitle', () => {
    beforeEach(() => {
      renderSectionTitle.reset();
      focusAndSetInputValue('c');
    });

    it('return value should be used to render titles', () => {
      const firstTitle = getTitle(0);

      expect(getInnerHTML(firstTitle)).to.equal('<strong>C</strong>');
    });

    it('should be called once per section', () => {
      expect(renderSectionTitle).to.have.been.calledOnce;
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
  });

  describe('getSectionSuggestions', () => {
    beforeEach(() => {
      getSectionSuggestions.reset();
      focusAndSetInputValue('j');
    });

    it('return value should be used to render section suggestions', () => {
      const firstSectionSuggestions = getSuggestionsBySectionIndex(0);

      expect(getInnerHTML(firstSectionSuggestions)).to.equal('<li id="react-autowhatever-1-section-0-item-0" role="option" class="react-autosuggest__item"><span>Java</span></li><li id="react-autowhatever-1-section-0-item-1" role="option" class="react-autosuggest__item"><span>Javascript</span></li>');
    });

    it('should be called once per section', () => {
      expect(getSectionSuggestions).to.have.been.calledOnce;
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
  });
});
