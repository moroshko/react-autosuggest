import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import { init, getStoredInput, getInputRef } from '../autowhatever-helpers';
import AutowhateverApp from './AutowhateverApp';

describe('Autowhatever with functional ref', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutowhateverApp />));
  });

  it('should store the ref', () => {
    expect(getStoredInput()).to.equal(getInputRef());
  });
});
