import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import sinon from 'sinon';
import AutowhateverApp from './AutowhateverApp';

describe('Autowhatever default props', () => {
  const render = (props) => {
    TestUtils.renderIntoDocument(<AutowhateverApp {...props} />);
  };

  describe('should throw', () => {
    sinon.stub(console, 'error');

    it('if renderItem is not provided', () => {
      const renderWithoutRenderItems = () =>
        render({
          renderSectionTitle: () => 'Section',
          getSectionItems: () => ['item'],
        });

      expect(renderWithoutRenderItems).to.throw('renderItem');
    });

    it('if renderSectionTitle is not provided', () => {
      const renderWithoutRenderItems = () =>
        render({ getSectionItems: () => ['item'], renderItem: () => null });

      expect(renderWithoutRenderItems).to.throw('renderSectionTitle');
    });

    it('if getSectionItems is not provided', () => {
      const renderWithoutRenderItems = () =>
        render({ renderSectionTitle: () => 'Section' });

      expect(renderWithoutRenderItems).to.throw('getSectionItems');
    });
  });
});
