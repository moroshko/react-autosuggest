import React from 'react';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import sinonChai from 'sinon-chai';
import { stripReactAttributes } from './utils';
import AppWithAutosuggest, {
  getSuggestionValue,
  renderSuggestion,
  onChange,
  onSuggestionSelected
} from './AppWithAutosuggest';

chai.use(sinonChai);

const { Simulate } = TestUtils;

let app, container, input;

function expectInputValue(expectedValue) {
  expect(input.value).to.equal(expectedValue);
}

function getSuggestions() {
  return TestUtils.scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__item')
}

function expectSuggestions(expectedSuggestions) {
  const suggestions = getSuggestions().map(suggestion => suggestion.textContent);

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

function clickDown(count = 1) {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(input, { key: 'ArrowDown' });
  }
}

function clickUp(count = 1) {
  for (let i = 0; i < count; i++) {
    Simulate.keyDown(input, { key: 'ArrowUp' });
  }
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

  describe('when pressing Down', () => {
    beforeEach(() => {
      focusInput();
      type('p');
    });

    it('should show suggestions with no focussed suggestion, if they are hidden', () => {
      clickEscape();
      clickDown();
      expectSuggestions(['Perl', 'PHP', 'Python']);
      expectFocusedSuggestion(null);
    });

    it('should focus on the first suggestion', () => {
      clickDown();
      expectFocusedSuggestion('Perl');
    });

    it('should focus on the next suggestion', () => {
      clickDown(2);
      expectFocusedSuggestion('PHP');
    });

    it('should not focus on any suggestion after reaching the last suggestion', () => {
      clickDown(4);
      expectFocusedSuggestion(null);
    });

    it('should focus on the first suggestion again', () => {
      clickDown(5);
      expectFocusedSuggestion('Perl');
    });
  });

  describe('when pressing Up', () => {
    beforeEach(() => {
      focusInput();
      type('p');
    });

    it('should show suggestions with no focussed suggestion, if they are hidden', () => {
      clickEscape();
      clickUp();
      expectSuggestions(['Perl', 'PHP', 'Python']);
      expectFocusedSuggestion(null);
    });

    it('should focus on the last suggestion', () => {
      clickUp();
      expectFocusedSuggestion('Python');
    });

    it('should focus on the second last suggestion', () => {
      clickUp(2);
      expectFocusedSuggestion('PHP');
    });

    it('should not focus on any suggestion after reaching the first suggestion', () => {
      clickUp(4);
      expectFocusedSuggestion(null);
    });

    it('should focus on the last suggestion again', () => {
      clickUp(5);
      expectFocusedSuggestion('Python');
    });
  });

  describe('renderSuggestion', () => {
    beforeEach(() => {
      renderSuggestion.reset();
      focusInput();
      type('r');
    });

    it('return value should be used to render suggestions', () => {
      const suggestions = getSuggestions();

      expect(stripReactAttributes(suggestions[0].innerHTML)).to.equal('<strong>R</strong><span>uby</span>');
    });

    it.only('should be called with the right parameters', () => {
      expect(renderSuggestion).to.have.been.calledWith(
        { name: 'Ruby', year: 1995 },
        'Ruby',
        'r'
      );
    });
  });
});
