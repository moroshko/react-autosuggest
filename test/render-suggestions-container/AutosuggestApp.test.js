import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  childrenMatcher,
  containerPropsMatcher,
  getInnerHTML,
  getElementWithClass,
  setInputValue
} from '../helpers';
import AutosuggestApp, { renderSuggestionsContainer } from './AutosuggestApp';

describe('Autosuggest with renderSuggestionsContainer', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
    renderSuggestionsContainer.resetHistory();
    setInputValue('c ');
  });

  it('should render whatever renderSuggestionsContainer returns', () => {
    expect(getElementWithClass('my-suggestions-container-footer')).not.to.equal(
      null
    );
    expect(getInnerHTML(getElementWithClass('my-query'))).to.equal('c');
  });

  it('should call renderSuggestionsContainer once with the right parameters', () => {
    expect(renderSuggestionsContainer).to.have.been.calledOnce;
    expect(renderSuggestionsContainer).to.be.calledWith({
      containerProps: containerPropsMatcher,
      children: childrenMatcher,
      query: 'c'
    });
  });
});
