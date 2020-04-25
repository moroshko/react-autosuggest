import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  getStoredInput,
  getStoredItemsContainer,
  getStoredHighlightedItem,
  getContainerAttribute,
  getInputAttribute,
  getItemsContainerAttribute,
  getItems,
  getItem,
  mouseEnterItem,
  mouseLeaveItem,
  mouseDownItem,
  clickItem,
  getInputRef,
} from '../autowhatever-helpers';
import AutowhateverApp, { renderItem } from './AutowhateverApp';

describe('Plain List Autowhatever', () => {
  beforeEach(() => {
    renderItem.resetHistory();
    init(TestUtils.renderIntoDocument(<AutowhateverApp />));
  });

  describe('initially', () => {
    it("should set container's `aria-owns` to items container's `id`", () => {
      expect(getContainerAttribute('aria-owns')).to.equal(
        getItemsContainerAttribute('id')
      );
    });

    it("should set input's `aria-controls` to items container's `id`", () => {
      expect(getInputAttribute('aria-controls')).to.equal(
        getItemsContainerAttribute('id')
      );
    });

    it('should render all items', () => {
      expect(getItems()).to.be.of.length(5);
    });

    it('should call `renderItem` exactly `items.length` times', () => {
      expect(renderItem).to.have.callCount(5);
    });

    it('should store the input on the instance', () => {
      expect(getStoredInput().getAttribute('id')).to.equal('my-fancy-input');
    });

    it('should store the items container on the instance', () => {
      expect(getStoredItemsContainer().getAttribute('id')).to.equal(
        'react-autowhatever-my-fancy-component'
      );
    });

    it('should set the stored highlighted item on the instance to null', () => {
      expect(getStoredHighlightedItem()).to.equal(null);
    });

    it('should set current input ref', () => {
      expect(getStoredInput()).to.equal(getInputRef().current);
    });
  });

  describe('hovering items', () => {
    it('should call `renderItem` once with the right parameters when item is entered', () => {
      renderItem.resetHistory();
      mouseEnterItem(0);
      expect(renderItem).to.have.been.calledOnce;
      expect(renderItem).to.be.calledWith({ text: 'Apple' });
    });

    it('should call `renderItem` twice when the highlighted item is changed', () => {
      mouseEnterItem(1);
      renderItem.resetHistory();
      mouseLeaveItem(1);
      mouseEnterItem(2);
      expect(renderItem).to.have.been.calledTwice;
    });

    it('should call `renderItem` with `isHighlighted` flag', () => {
      renderItem.resetHistory();
      mouseEnterItem(0);
      expect(renderItem).to.have.been.calledOnce;
      expect(renderItem).to.be.calledWith(
        { text: 'Apple' },
        { isHighlighted: true }
      );

      renderItem.resetHistory();
      mouseLeaveItem(0);
      expect(renderItem).to.have.been.calledOnce;
      expect(renderItem).to.be.calledWith(
        { text: 'Apple' },
        { isHighlighted: false }
      );
    });

    it('should set `aria-selected` to true on highlighted items', () => {
      renderItem.resetHistory();
      mouseEnterItem(0);
      expect(getItem(0).getAttribute('aria-selected')).to.equal('true');

      renderItem.resetHistory();
      mouseLeaveItem(0);
      expect(getItem(0).getAttribute('aria-selected')).to.equal('false');
    });

    it('should call `renderItem` once when item is left', () => {
      mouseEnterItem(3);
      renderItem.resetHistory();
      mouseLeaveItem(3);
      expect(renderItem).to.have.been.calledOnce;
    });

    it('should not call `renderItem` when item is clicked', () => {
      renderItem.resetHistory();
      mouseDownItem(4);
      clickItem(4);
      expect(renderItem).not.to.have.been.called;
    });

    it('should store the highlighted item on the instance', () => {
      mouseEnterItem(2);
      expect(getStoredHighlightedItem().getAttribute('id')).to.equal(
        'react-autowhatever-my-fancy-component--item-2'
      );

      mouseLeaveItem(2);
      expect(getStoredHighlightedItem()).to.equal(null);

      mouseEnterItem(3);
      expect(getStoredHighlightedItem().getAttribute('id')).to.equal(
        'react-autowhatever-my-fancy-component--item-3'
      );
    });
  });
});
