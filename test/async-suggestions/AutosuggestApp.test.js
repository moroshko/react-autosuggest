import React from 'react';
import TestUtils from 'react-dom/test-utils';
import {
  init,
  tick,
  expectSuggestions,
  clickSuggestion,
  clickEnter,
  clickDown,
  setInputValue,
  focusAndSetInputValue
} from '../helpers';
import AutosuggestApp from './AutosuggestApp';

describe('Autosuggest that gets suggestions asynchronously', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('when typing and matches exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('j');
      tick(100);
    });

    it('should show suggestions when they arrive', () => {
      expectSuggestions(['Java', 'JavaScript']);
    });

    it('should not show previous suggestions when revealing suggestions', () => {
      setInputValue('');
      setInputValue('p');
      expectSuggestions([]);
    });
  });

  describe('when suggestion is clicked', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      tick(100);
    });

    it('should hide suggestions', () => {
      clickSuggestion(1);
      tick(500);
      expectSuggestions([]);
    });
  });

  describe('when pressing Enter', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      tick(100);
    });

    it('should hide suggestions', () => {
      clickDown();
      clickEnter();
      tick(500);
      expectSuggestions([]);
    });

    it('should not error if suggestions were cleared after having suggestions', () => {
      focusAndSetInputValue('pz');
      tick(100);
      clickEnter();
      expectSuggestions([]);
    });
  });
});
