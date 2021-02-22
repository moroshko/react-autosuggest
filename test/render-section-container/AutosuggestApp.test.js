import sinon from 'sinon';
import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  childrenMatcher,
  getInnerHTML,
  getElementWithClass,
  setInputValue
} from '../helpers';
import AutosuggestApp, { renderSectionContainer } from './AutosuggestApp';

describe('Autosuggest with renderSectionContainer', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
    renderSectionContainer.resetHistory();
    setInputValue('c ');
  });

  it('should render whatever renderSectionContainer returns', () => {
    expect(getElementWithClass('my-section-container-header')).not.to.equal(
      null
    );
    expect(getInnerHTML(getElementWithClass('my-query'))).to.equal('c');
  });

  it('should call renderSectionContainer once with the right parameters', () => {
    expect(renderSectionContainer).to.have.been.calledOnce;
    expect(renderSectionContainer).to.be.calledWith({
      containerProps: sinon.match({
        key: sinon.match.string,
        className: sinon.match.string,
      }),
      children: childrenMatcher,
      query: 'c',
      section: sinon.match({
        title: sinon.match.string,
        languages: sinon.match.every(sinon.match({
          name: sinon.match.string,
          year: sinon.match.number
        }))
      })
    });
  });
});
