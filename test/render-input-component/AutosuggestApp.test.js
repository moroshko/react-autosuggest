import React from 'react';
import TestUtils from 'react-dom/test-utils';
import {
  init,
  expectInputAttribute,
  expectInputReferenceToBeSet
} from '../helpers';
import AutosuggestApp from './AutosuggestApp';

describe('Autosuggest with renderInputComponent', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('initially', () => {
    it("should set input's id", () => {
      expectInputAttribute('id', 'my-custom-input');
    });

    it('should set the input reference', () => {
      expectInputReferenceToBeSet();
    });
  });
});
