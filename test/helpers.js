import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { render } from 'react-dom';
import SyntheticEvent from 'react/lib/SyntheticEvent';
import { Simulate } from 'react-addons-test-utils';
import simulant from 'simulant';

chai.use(sinonChai);

let storedInput, container, input, suggestionsContainer;
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

export const init = app => {
  const component = render(app, document.getElementById('app'));

  storedInput = component.input;
  container = document.querySelector('.react-autosuggest__container');
  input = document.querySelector('.react-autosuggest__input');
  suggestionsContainer = document.querySelector('.react-autosuggest__suggestions-container');
};

export const syntheticEventMatcher = sinon.match.instanceOf(SyntheticEvent);

const reactAttributesRegex = / data-react[-\w]+="[^"]*"/g;

// See: http://stackoverflow.com/q/28979533/247243
const stripReactAttributes = html => html.replace(reactAttributesRegex, '');

export const getInnerHTML = element => stripReactAttributes(element.innerHTML);

export const expectContainerAttribute = (attributeName, expectedValue) => {
  expect(container.getAttribute(attributeName)).to.equal(expectedValue);
};

export const expectInputAttribute = (attributeName, expectedValue) => {
  expect(input.getAttribute(attributeName)).to.equal(expectedValue);
};

export const getSuggestionsContainerAttribute = attributeName => (
  suggestionsContainer.getAttribute(attributeName)
);

export const expectInputValue = expectedValue => {
  expect(input.value).to.equal(expectedValue);
};

export const getSuggestionsList = () => (
  document.querySelector('.react-autosuggest__suggestions-list')
);

export const getSuggestions = () => (
  Array.from(document.querySelectorAll('.react-autosuggest__suggestion'))
);

export const getSuggestion = suggestionIndex => {
  const suggestions = getSuggestions();

  if (suggestionIndex >= suggestions.length) {
    throw Error(`Cannot find suggestion #${suggestionIndex}`);
  }

  return suggestions[suggestionIndex];
};

export const getTitles = () => (
  Array.from(document.querySelectorAll('.react-autosuggest__section-title'))
);

export const getTitle = titleIndex => {
  const titles = getTitles();

  if (titleIndex >= titles.length) {
    throw Error(`Cannot find title #${titleIndex}`);
  }

  return titles[titleIndex];
};

export const expectInputReferenceToBeSet = () => {
  expect(storedInput).to.equal(input);
};

export const expectSuggestions = expectedSuggestions => {
  const suggestions = getSuggestions().map(suggestion => suggestion.textContent);

  expect(suggestions).to.deep.equal(expectedSuggestions);
};

export const expectFocusedSuggestion = suggestion => {
  const focusedSuggestions = Array.from(document.querySelectorAll('.react-autosuggest__suggestion--focused'));

  if (suggestion === null) {
    expect(focusedSuggestions).to.have.length(0);
  } else {
    expect(focusedSuggestions).to.have.length(1);
    expect(focusedSuggestions[0].textContent).to.equal(suggestion);
  }
};

export const mouseEnterSuggestion = suggestionIndex => {
  //Simulate.mouseEnter(getSuggestion(suggestionIndex));
  //simulant.fire(getSuggestion(suggestionIndex), 'mouseenter');
  getSuggestion(suggestionIndex).dispatchEvent(new window.MouseEvent('mouseenter'));
};

export const mouseLeaveSuggestion = suggestionIndex => {
  simulant.fire(getSuggestion(suggestionIndex), 'mouseleave');
};

// It doesn't feel right to emulate all the DOM events by copying the implementation.
// Please show me a better way to emulate this.
export const clickSuggestion = suggestionIndex => {
  mouseEnterSuggestion(suggestionIndex);
  simulant.fire(getSuggestion(suggestionIndex), 'mousedown');
  blurInput();
  simulant.fire(getSuggestion(suggestionIndex), 'click');
};

export const clickSuggestionsContainer = () => {
  simulant.fire(suggestionsContainer, 'mousedown');
  blurInput();
  simulant.fire(suggestionsContainer, 'click');
};

export const focusInput = () => {
  input.focus();
};

export const blurInput = () => {
  input.blur();
};

export const clickEscape = () => {
  Simulate.keyDown(input, { key: 'Escape' });
};

export const clickEnter = () => {
  Simulate.keyDown(input, { key: 'Enter' });
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
  //input.dispatchEvent(new window.Event('change'));
};

export const focusAndSetInputValue = value => {
  focusInput();
  setInputValue(value);
};

export const isInputFocused = () => document.activeElement === input;
