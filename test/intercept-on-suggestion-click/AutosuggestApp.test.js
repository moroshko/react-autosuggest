import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  clickSuggestion,
  focusAndSetInputValue,
  expectInputValue
} from '../helpers';
import AutosuggestApp, { onSuggestionClick } from './AutosuggestApp';

describe('Autosuggest with onSuggestionClick={interceptorFunction}', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when suggestion is clicked with click interceptor specified on clicked value', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      onSuggestionClick.reset();
      clickSuggestion(1);
    });

    it('should call interceptor function', () => {
      expect(onSuggestionClick).to.have.been.calledOnce;
    });

    it('input value should not be changed', () => {
      expectInputValue('p');
    });
  });

  describe('when suggestion is clicked with click interceptor not specified on clicked value', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      onSuggestionClick.reset();
      clickSuggestion(2);
    });

    it('should call interceptor function', () => {
      expect(onSuggestionClick).to.have.been.calledOnce;
    });

    it('input value should not be changed', () => {
      expectInputValue('Python');
    });
  });
});
