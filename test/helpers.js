import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import ReactDom from 'react-dom';
import TestUtils, { Simulate } from 'react-dom/test-utils';

chai.use(sinonChai);

const clock = sinon.useFakeTimers();

let app, container, input, suggestionsContainer, clearButton;
let eventsArray = [];

export const { tick } = clock;

export const clearEvents = () => {
  eventsArray = [];
};

export const addEvent = event => {
  eventsArray.push(event);
};

export const getEvents = () => {
  return eventsArray;
};

export const init = application => {
  app = application;
  container = TestUtils.findRenderedDOMComponentWithClass(
    app,
    'react-autosuggest__container'
  );
  input = TestUtils.findRenderedDOMComponentWithTag(app, 'input');
  suggestionsContainer = TestUtils.findRenderedDOMComponentWithClass(
    app,
    'react-autosuggest__suggestions-container'
  );
  clearButton = TestUtils.scryRenderedDOMComponentsWithTag(app, 'button')[0];
};

// Since react-dom doesn't export SyntheticEvent anymore
export const syntheticEventMatcher = sinon.match(value => {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const proto = Object.getPrototypeOf(value);

  if ('_dispatchListeners' in value && proto && proto.constructor.Interface) {
    return true;
  }
  return false;
}, 'of SyntheticEvent type');
export const childrenMatcher = sinon.match.any;
export const containerPropsMatcher = sinon.match({
  id: sinon.match.string,
  key: sinon.match.string,
  className: sinon.match.string,
  ref: sinon.match.func
});

const reactAttributesRegex = / data-react[-\w]+="[^"]+"/g;

// See: http://stackoverflow.com/q/28979533/247243
const stripReactAttributes = html => html.replace(reactAttributesRegex, '');

export const getInnerHTML = element => stripReactAttributes(element.innerHTML);

export const getElementWithClass = className =>
  TestUtils.findRenderedDOMComponentWithClass(app, className);

export const expectContainerAttribute = (attributeName, expectedValue) => {
  expect(container.getAttribute(attributeName)).to.equal(expectedValue);
};

export const expectInputAttribute = (attributeName, expectedValue) => {
  expect(input.getAttribute(attributeName)).to.equal(expectedValue);
};

export const getSuggestionsContainerAttribute = attributeName =>
  suggestionsContainer.getAttribute(attributeName);

export const expectInputValue = expectedValue => {
  expect(input.value).to.equal(expectedValue);
};

export const getSuggestionsList = () =>
  TestUtils.findRenderedDOMComponentWithClass(
    app,
    'react-autosuggest__suggestions-list'
  );

export const getSuggestions = () =>
  TestUtils.scryRenderedDOMComponentsWithClass(
    app,
    'react-autosuggest__suggestion'
  );

export const getSuggestion = suggestionIndex => {
  const suggestions = getSuggestions();

  if (suggestionIndex >= suggestions.length) {
    throw Error(
      `
      Cannot find suggestion #${suggestionIndex}.
      ${
        suggestions.length === 0
          ? 'No suggestions found.'
          : `Only ${suggestions.length} suggestion${
              suggestions.length === 1 ? '' : 's'
            } found.`
      }
    `
    );
  }

  return suggestions[suggestionIndex];
};

export const expectSuggestionAttribute = (
  suggestionIndex,
  attributeName,
  expectedValue
) => {
  expect(getSuggestion(suggestionIndex).getAttribute(attributeName)).to.equal(
    expectedValue
  );
};

export const getTitles = () =>
  TestUtils.scryRenderedDOMComponentsWithClass(
    app,
    'react-autosuggest__section-title'
  );

export const getTitle = titleIndex => {
  const titles = getTitles();

  if (titleIndex >= titles.length) {
    throw Error(`Cannot find title #${titleIndex}`);
  }

  return titles[titleIndex];
};

export const expectInputReferenceToBeSet = () => {
  expect(app.input).to.equal(input);
};

export const expectSuggestions = expectedSuggestions => {
  const suggestions = getSuggestions().map(
    suggestion => suggestion.textContent
  );

  expect(suggestions).to.deep.equal(expectedSuggestions);
};

export const expectHighlightedSuggestion = suggestion => {
  const highlightedSuggestions = TestUtils.scryRenderedDOMComponentsWithClass(
    app,
    'react-autosuggest__suggestion--highlighted'
  );

  if (suggestion === null) {
    expect(highlightedSuggestions).to.have.length(0);
  } else {
    expect(highlightedSuggestions).to.have.length(1);
    expect(highlightedSuggestions[0].textContent).to.equal(suggestion);
  }
};

export const saveKeyDown = (event) => {
  let runBrowserDefault = event.defaultPrevented
    ? 'defaultPrevented'
    : 'runBrowserDefault';

  addEvent('onKeyDown-' + runBrowserDefault);
};

export const expectLetBrowserHandleKeyDown = () => {
  expect(getEvents()).to.not.deep.include('onKeyDown-defaultPrevented');
  expect(getEvents()).to.deep.include('onKeyDown-runBrowserDefault');
};

export const expectDontLetBrowserHandleKeyDown = () => {
  expect(getEvents()).to.not.deep.include('onKeyDown-runBrowserDefault');
  expect(getEvents()).to.deep.include('onKeyDown-defaultPrevented');
};

export const mouseEnterSuggestion = suggestionIndex => {
  Simulate.mouseEnter(getSuggestion(suggestionIndex));
};

export const mouseLeaveSuggestion = suggestionIndex => {
  Simulate.mouseLeave(getSuggestion(suggestionIndex));
};

export const mouseDownSuggestion = suggestionIndex => {
  Simulate.mouseDown(getSuggestion(suggestionIndex));
};

const mouseDownDocument = target => {
  document.dispatchEvent(
    new window.CustomEvent('mousedown', {
      detail: {
        // must be 'detail' accoring to docs: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_–_CustomEvent()
        target
      }
    })
  );
};

export const mouseUpDocument = target => {
  document.dispatchEvent(
    new window.CustomEvent(
      'mouseup',
      target
        ? {
            detail: {
              // must be 'detail' accoring to docs: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_–_CustomEvent()
              target
            }
          }
        : null
    )
  );
};

const touchStartSuggestion = suggestionIndex => {
  Simulate.touchStart(getSuggestion(suggestionIndex));
};

const touchMoveSuggestion = suggestionIndex => {
  Simulate.touchMove(getSuggestion(suggestionIndex));
};

// It doesn't feel right to emulate all the DOM events by copying the implementation.
// Please show me a better way to emulate this.
export const clickSuggestion = suggestionIndex => {
  const suggestion = getSuggestion(suggestionIndex);

  mouseEnterSuggestion(suggestionIndex);
  mouseDownDocument(suggestion);
  mouseDownSuggestion(suggestionIndex);
  mouseUpDocument(suggestion);
  blurInput();
  focusInput();
  Simulate.click(suggestion);
  clock.tick(1);
};

// Simulates only mouse events since on touch devices dragging considered as a scroll and is a different case.
export const dragSuggestionOut = suggestionIndex => {
  const suggestion = getSuggestion(suggestionIndex);

  mouseEnterSuggestion(suggestionIndex);
  mouseDownDocument(suggestion);
  mouseDownSuggestion(suggestionIndex);
  mouseLeaveSuggestion(suggestionIndex);
  mouseUpDocument();
};

export const dragSuggestionOutAndIn = suggestionIndex => {
  const suggestion = getSuggestion(suggestionIndex);

  mouseEnterSuggestion(suggestionIndex);
  mouseDownDocument(suggestion);
  mouseDownSuggestion(suggestionIndex);
  mouseLeaveSuggestion(suggestionIndex);
  mouseEnterSuggestion(suggestionIndex);
  mouseUpDocument();
  blurInput();
  focusInput();
  Simulate.click(suggestion);
  clock.tick(1);
};

// Simulates mouse events as well as touch events since some browsers (chrome) mirror them and we should handle this.
// Order of events is implemented according to docs: https://developer.mozilla.org/en-US/docs/Web/API/Touch_events/Supporting_both_TouchEvent_and_MouseEvent
export const dragSuggestionOutTouch = suggestionIndex => {
  touchStartSuggestion(suggestionIndex);
  touchMoveSuggestion(suggestionIndex);
  mouseDownSuggestion(suggestionIndex);
  mouseUpDocument();
};

export const clickSuggestionsContainer = () => {
  mouseDownDocument(suggestionsContainer);
  blurInput();
  focusInput();
};

export const focusInput = () => {
  Simulate.focus(input);
};

export const blurInput = () => {
  Simulate.blur(input);
};

export const clickEscape = () => {
  Simulate.keyDown(input, { key: 'Escape', keyCode: 27 }); // throws if key is missing
};

export const clickEnter = () => {
  Simulate.keyDown(input, { key: 'Enter', keyCode: 13 }); // throws if key is missing
  clock.tick(1);
};

// See #388
export const clickCombinedCharacterEnter = () => {
  Simulate.keyDown(input, { key: 'Enter', keyCode: 229 }); // throws if key is missing
  clock.tick(1);
};

export const clickDown = (count = 1) => {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(input, { key: 'ArrowDown', keyCode: 40 }); // throws if key is missing
  }
};

export const clickUp = (count = 1) => {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(input, { key: 'ArrowUp', keyCode: 38 }); // throws if key is missing
  }
};

export const setInputValue = value => {
  input.value = value;
  Simulate.change(input);
};

export const focusAndSetInputValue = value => {
  focusInput();
  setInputValue(value);
};

export const isInputFocused = () => document.activeElement === input;

export const clickClearButton = () => {
  if (clearButton) {
    Simulate.mouseDown(clearButton);
  } else {
    throw new Error("Clear button doesn't exist");
  }
};

export const unmountApp = () => {
  // eslint-disable-next-line react/no-find-dom-node
  ReactDom.unmountComponentAtNode(ReactDom.findDOMNode(app).parentNode);
};
