import chai from 'chai';
import sinonChai from 'sinon-chai';
import TestUtils, { Simulate } from 'react-dom/test-utils';

chai.use(sinonChai);

let app, container, input, itemsContainer;

export const init = (application) => {
  app = application;
  container = TestUtils.findRenderedDOMComponentWithClass(
    app,
    'react-autowhatever__container'
  );
  input = TestUtils.findRenderedDOMComponentWithTag(app, 'input');
  itemsContainer = TestUtils.findRenderedDOMComponentWithClass(
    app,
    'react-autowhatever__items-container'
  );
};

export const getElementWithClass = (className) =>
  TestUtils.findRenderedDOMComponentWithClass(app, className);

export const getStoredInput = () => app.autowhatever.input;
export const getStoredItemsContainer = () => app.autowhatever.itemsContainer;
export const getStoredHighlightedItem = () => app.autowhatever.highlightedItem;
export const getInputRef = () => app.inputRef;

export const getContainerAttribute = (attr) => container.getAttribute(attr);

export const getInputAttribute = (attr) => input.getAttribute(attr);

export const getItemsContainerAttribute = (attr) =>
  itemsContainer.getAttribute(attr);

export const getItems = () =>
  TestUtils.scryRenderedDOMComponentsWithClass(app, 'react-autowhatever__item');

export const getItem = (itemIndex) => {
  const items = getItems();

  if (itemIndex >= items.length) {
    throw Error(`Cannot find item #${itemIndex}`);
  }

  return items[itemIndex];
};

export const mouseEnterItem = (itemIndex) =>
  Simulate.mouseEnter(getItem(itemIndex));

export const mouseLeaveItem = (itemIndex) =>
  Simulate.mouseLeave(getItem(itemIndex));

export const mouseDownItem = (itemIndex) =>
  Simulate.mouseDown(getItem(itemIndex));

export const clickItem = (itemIndex) => Simulate.click(getItem(itemIndex));

export const clickUp = () => Simulate.keyDown(input, { key: 'ArrowUp' });

export const clickDown = () => Simulate.keyDown(input, { key: 'ArrowDown' });

export const clickEnter = () => Simulate.keyDown(input, { key: 'Enter' });
