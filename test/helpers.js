import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SyntheticEvent from 'react/lib/SyntheticEvent';
import TestUtils, { Simulate } from 'react-addons-test-utils';

chai.use(sinonChai);

let data = null;

export function init(d) {
  data = d;
}

export const eventInstance = sinon.match.instanceOf(SyntheticEvent);

const reactAttributesRegex = / data-react[-\w]+="[^"]+"/g;

// See: http://stackoverflow.com/q/28979533/247243
function stripReactAttributes(html) {
  return html.replace(reactAttributesRegex, '');
}

export function getInnerHTML(element) {
  return stripReactAttributes(element.innerHTML);
}

export function expectInputAttribute(attributeName, expectedValue) {
  expect(data.input.getAttribute(attributeName)).to.equal(expectedValue);
}

export function expectInputValue(expectedValue) {
  expect(data.input.value).to.equal(expectedValue);
}

export function getSuggestionsContainer() {
  return TestUtils.findRenderedDOMComponentWithClass(data.app, 'react-autosuggest__suggestions-container');
}

export function getSuggestions() {
  return TestUtils.scryRenderedDOMComponentsWithClass(data.app, 'react-autosuggest__item');
}

export function getSuggestion(suggestionIndex) {
  const suggestions = getSuggestions();

  if (suggestionIndex >= suggestions.length) {
    throw Error(`Cannot find suggestion #${suggestionIndex}`);
    return null;
  }

  return suggestions[suggestionIndex];
};

export function expectSuggestions(expectedSuggestions) {
  const suggestions = getSuggestions().map(suggestion => suggestion.textContent);

  expect(suggestions).to.deep.equal(expectedSuggestions);
}

export function expectFocusedSuggestion(suggestion) {
  const focusedSuggestions = TestUtils
    .scryRenderedDOMComponentsWithClass(data.app, 'react-autosuggest__item--focused');

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

export function clickSuggestion(suggestionIndex) {
  mouseEnterSuggestion(suggestionIndex);
  Simulate.click(getSuggestion(suggestionIndex));
}

export function focusInput() {
  Simulate.focus(data.input);
}

export function blurInput() {
  Simulate.blur(data.input);
}

export function clickEscape() {
  Simulate.keyDown(data.input, { key: 'Escape' });
}

export function clickEnter() {
  Simulate.keyDown(data.input, { key: 'Enter' });
}

export function clickDown(count = 1) {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(data.input, { key: 'ArrowDown' });
  }
}

export function clickUp(count = 1) {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(data.input, { key: 'ArrowUp' });
  }
}

export function focusAndSetInputValue(value) {
  focusInput();
  data.input.value = value;
  Simulate.change(data.input);
}
