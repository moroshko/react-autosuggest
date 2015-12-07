import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import AppWithAutosuggest from './AppWithAutosuggest';

const { Simulate } = TestUtils;

let app, container, input;

function expectInputValue(expectedValue) {
  expect(input.value).to.equal(expectedValue);
}

function expectSuggestions(expectedSuggestions) {
  const suggestions = TestUtils
    .scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__item')
    .map(suggestion => suggestion.textContent);

  expect(suggestions).to.deep.equal(expectedSuggestions);
}

function expectFocusedSuggestion(suggestion) {
  const focusedSuggestions = TestUtils
    .scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__item--focused');

  if (suggestion === null) {
    expect(focusedSuggestions).to.have.length(0);
  } else {
    expect(focusedSuggestions).to.have.length(1);
    expect(focusedSuggestions[0].textContent).to.equal(suggestion);
  }
}

function focusInput() {
  Simulate.focus(input);
}

function blurInput() {
  Simulate.blur(input);
}

function clickEscape() {
  Simulate.keyDown(input, { key: 'Escape' });
}

function clickEnter() {
  Simulate.keyDown(input, { key: 'Enter' });
}

function clickDown() {
  Simulate.keyDown(input, { key: 'ArrowDown' });
}

function clickUp() {
  Simulate.keyDown(input, { key: 'ArrowUp' });
}

function type(value) {
  input.value = value;
  Simulate.change(input);
}

describe('Autosuggest', () => {
  beforeEach(() => {
    app = TestUtils.renderIntoDocument(React.createElement(AppWithAutosuggest));
    container = TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__container');
    input = TestUtils.findRenderedDOMComponentWithTag(app, 'input');
  });

  describe('initially', () => {
    describe('should render a text box and set its:', () => {
      it('id', () => {
        expect(input.id).to.equal('my-awesome-autosuggest');
      });

      it('className', () => {
        expect(input.className).to.equal('react-autosuggest__input');
      });

      it('placeholder', () => {
        expect(input.getAttribute('placeholder')).to.equal('Type a programming language');
      });

      it('type', () => {
        expect(input.type).to.equal('search');
      });

      it('value', () => {
        expectInputValue('initial value');
      });
    });

    it('should not show suggestions', () => {
      expectSuggestions([]);
    });
  });

  describe('when typing and matches exist', () => {
    beforeEach(() => {
      focusInput();
      type('p');
    });

    it('should show suggestions', () => {
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });

    it('should not focus on any suggestion', () => {
      expectFocusedSuggestion(null);
    });

    it('should hide suggestions when ESC is pressed', () => {
      clickEscape();
      expectSuggestions([]);
    });

    it('should clear the input when ESC is pressed again', () => {
      clickEscape();
      clickEscape();
      expectInputValue('');
    });

    it('should hide suggestions when input is blurred', () => {
      blurInput();
      expectSuggestions([]);
    });

    it('should show suggestions when input is focussed again', () => {
      blurInput();
      focusInput();
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });
  });

  describe('when typing and matches do not exist', () => {
    beforeEach(() => {
      focusInput();
      type('z');
    });

    it('should not show suggestions', () => {
      expectSuggestions([]);
    });
  });
});
