import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  focusAndSetInputValue,
  clickDown,
  clickEnter,
  expectInputValue,
  clearEvents,
  expectLetBrowserHandleKeyDown,
  expectDontLetBrowserHandleKeyDown
} from '../helpers';
import AutosuggestApp, { onSuggestionSelected } from './AutosuggestApp';

describe('Autosuggest with textarea', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));

    focusAndSetInputValue('p');
    clearEvents();
  });

  it("inserts a newline if you press enter without selecting a suggestion", () => {
    clickEnter();

    expectInputValue('p');
    expect(onSuggestionSelected).not.to.have.been.called;
    expectLetBrowserHandleKeyDown();
  });

  it("doesn't insert a newline if you select a suggestion with enter", () => {
    clickDown();
    clearEvents();
    clickEnter();

    expectInputValue('Perl');
    expect(onSuggestionSelected).to.have.been.calledOnce;
    expectDontLetBrowserHandleKeyDown();
  });
});
