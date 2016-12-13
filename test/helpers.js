import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import SyntheticEvent from 'react-dom/lib/SyntheticEvent';
import TestUtils, { Simulate } from 'react-addons-test-utils';

chai.use(sinonChai);

const clock = sinon.useFakeTimers();

let app, container, input, suggestionsContainer, clearButton;
let eventsArray = [];

export const tick = clock.tick;

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
  suggestionsContainer = TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__suggestions-container');
  clearButton = TestUtils.scryRenderedDOMComponentsWithTag(app, 'button')[0];
};

export const syntheticEventMatcher = sinon.match.instanceOf(SyntheticEvent);

const reactAttributesRegex = / data-react[-\w]+="[^"]+"/g;

// See: http://stackoverflow.com/q/28979533/247243
const stripReactAttributes = html => html.replace(reactAttributesRegex, '');

export const getInnerHTML = element => stripReactAttributes(element.innerHTML);

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
  TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__suggestions-list');

export const getSuggestions = () =>
 TestUtils.scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__suggestion');

export const getSuggestion = suggestionIndex => {
  const suggestions = getSuggestions();

  if (suggestionIndex >= suggestions.length) {
    throw Error(`
      Cannot find suggestion #${suggestionIndex}.
      ${
        suggestions.length === 0 ?
        'No suggestions found.' :
        `Only ${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'} found.`
      }
    `);
  }

  return suggestions[suggestionIndex];
};

export const getTitles = () =>
  TestUtils.scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__section-title');

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
  const suggestions = getSuggestions().map(suggestion => suggestion.textContent);

  expect(suggestions).to.deep.equal(expectedSuggestions);
};

export const expectFocusedSuggestion = suggestion => {
  const focusedSuggestions = TestUtils
    .scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__suggestion--focused');

  if (suggestion === null) {
    expect(focusedSuggestions).to.have.length(0);
  } else {
    expect(focusedSuggestions).to.have.length(1);
    expect(focusedSuggestions[0].textContent).to.equal(suggestion);
  }
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
  document.dispatchEvent(new window.CustomEvent('mousedown', {
    detail: { // must be 'detail' accoring to docs: https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Creating_and_triggering_events#Adding_custom_data_–_CustomEvent()
      target
    }
  }));
};

// It doesn't feel right to emulate all the DOM events by copying the implementation.
// Please show me a better way to emulate this.
export const clickSuggestion = suggestionIndex => {
  const suggestion = getSuggestion(suggestionIndex);

  mouseEnterSuggestion(suggestionIndex);
  mouseDownDocument(suggestion);
  mouseDownSuggestion(suggestionIndex);
  blurInput();
  focusInput();
  Simulate.click(suggestion);
  clock.tick(1);
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
  Simulate.keyDown(input, { key: 'Escape' });
};

export const clickEnter = () => {
  Simulate.keyDown(input, { key: 'Enter' });
  clock.tick(1);
};

export const clickDown = (count = 1) => {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(input, { key: 'ArrowDown' });
  }
};

export const clickUp = (count = 1) => {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(input, { key: 'ArrowUp' });
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
    throw new Error('Clear button doesn\'t exist');
  }
};
