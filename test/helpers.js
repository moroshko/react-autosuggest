import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SyntheticEvent from 'react/lib/SyntheticEvent';
import TestUtils, { Simulate } from 'react-addons-test-utils';

chai.use(sinonChai);

let app, container, input;
let eventsArray = [];

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
  container = TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__container');
  input = TestUtils.findRenderedDOMComponentWithTag(app, 'input');
};

export const eventInstance = sinon.match.instanceOf(SyntheticEvent);

const reactAttributesRegex = / data-react[-\w]+="[^"]+"/g;

// See: http://stackoverflow.com/q/28979533/247243
function stripReactAttributes(html) {
  return html.replace(reactAttributesRegex, '');
}

export function getInnerHTML(element) {
  return stripReactAttributes(element.innerHTML);
}

export function expectContainerAttribute(attributeName, expectedValue) {
  expect(container.getAttribute(attributeName)).to.equal(expectedValue);
}

export function expectInputAttribute(attributeName, expectedValue) {
  expect(input.getAttribute(attributeName)).to.equal(expectedValue);
}

export function expectSuggestionsContainerAttribute(attributeName, expectedValue) {
  expect(getSuggestionsContainer().getAttribute(attributeName)).to.equal(expectedValue);
}

export function expectInputValue(expectedValue) {
  expect(input.value).to.equal(expectedValue);
}

export function getSuggestionsContainer() {
  return TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__suggestions-container');
}

export function getSuggestionsList() {
  return TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__suggestions-list');
}

export function getSuggestions() {
  return TestUtils.scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__suggestion');
}

export function getSuggestion(suggestionIndex) {
  const suggestions = getSuggestions();

  if (suggestionIndex >= suggestions.length) {
    throw Error(`Cannot find suggestion #${suggestionIndex}`);
  }

  return suggestions[suggestionIndex];
}

export function getTitles() {
  return TestUtils.scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__section-title');
}

export function getTitle(titleIndex) {
  const titles = getTitles();

  if (titleIndex >= titles.length) {
    throw Error(`Cannot find title #${titleIndex}`);
  }

  return titles[titleIndex];
}

export function expectInputReferenceToBeSet() {
  expect(app.input).to.equal(input);
}

export function expectSuggestions(expectedSuggestions) {
  const suggestions = getSuggestions().map(suggestion => suggestion.textContent);

  expect(suggestions).to.deep.equal(expectedSuggestions);
}

export function expectFocusedSuggestion(suggestion) {
  const focusedSuggestions = TestUtils
    .scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__suggestion--focused');

  if (suggestion === null) {
    expect(focusedSuggestions).to.have.length(0);
  } else {
    expect(focusedSuggestions).to.have.length(1);
    expect(focusedSuggestions[0].textContent).to.equal(suggestion);
  }
}

export function mouseEnterSuggestion(suggestionIndex) {
  Simulate.mouseEnter(getSuggestion(suggestionIndex));
}

export function mouseLeaveSuggestion(suggestionIndex) {
  Simulate.mouseLeave(getSuggestion(suggestionIndex));
}

export function mouseDownSuggestion(suggestionIndex) {
  Simulate.mouseDown(getSuggestion(suggestionIndex));
}

export function clickSuggestion(suggestionIndex) {
  mouseEnterSuggestion(suggestionIndex);
  mouseDownSuggestion(suggestionIndex);
  blurInput();
  Simulate.click(getSuggestion(suggestionIndex));
}

export function focusInput() {
  Simulate.focus(input);
}

export function blurInput() {
  Simulate.blur(input);
}

export function clickEscape() {
  Simulate.keyDown(input, { key: 'Escape' });
}

export function clickEnter() {
  Simulate.keyDown(input, { key: 'Enter' });
}

export function clickDown(count = 1) {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(input, { key: 'ArrowDown' });
  }
}

export function clickUp(count = 1) {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(input, { key: 'ArrowUp' });
  }
}

export function setInputValue(value) {
  input.value = value;
  Simulate.change(input);
}

export function focusAndSetInputValue(value) {
  focusInput();
  setInputValue(value);
}

export function isInputFocused() {
  return global.document.activeElement === input;
}
