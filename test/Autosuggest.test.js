import React from 'react';
import SyntheticEvent from 'react/lib/SyntheticEvent';
import TestUtils from 'react-addons-test-utils';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import { stripReactAttributes } from './utils';
import AppWithAutosuggest, {
  getSuggestionValue,
  renderSuggestion,
  onChange,
  shouldRenderSuggestions,
  onSuggestionSelected
} from './AppWithAutosuggest';

chai.use(sinonChai);

const { Simulate } = TestUtils;
const eventInstance = sinon.match.instanceOf(SyntheticEvent);

let app, container, input;

function expectInputValue(expectedValue) {
  expect(input.value).to.equal(expectedValue);
}

function getSuggestionsContainer() {
  return TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__suggestions-container');
}

function getSuggestions() {
  return TestUtils.scryRenderedDOMComponentsWithClass(app, 'react-autosuggest__item');
}

function getSuggestion(suggestionIndex) {
  const suggestions = getSuggestions();

  if (suggestionIndex >= suggestions.length) {
    throw Error(`Cannot find suggestion #${suggestionIndex}`);
    return null;
  }

  return suggestions[suggestionIndex];
};

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

function clickSuggestion(suggestionIndex) {
  mouseEnterSuggestion(suggestionIndex);
  Simulate.click(getSuggestion(suggestionIndex));
}

function mouseEnterSuggestion(suggestionIndex) {
  Simulate.mouseEnter(getSuggestion(suggestionIndex));
}

function mouseLeaveSuggestion(suggestionIndex) {
  Simulate.mouseLeave(getSuggestion(suggestionIndex));
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

function focusAndSetInputValue(value) {
  focusInput();
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
    describe('should render an input and set its:', () => {
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
        expectInputValue('');
      });
    });

    it('should not show suggestions', () => {
      expectSuggestions([]);
    });
  });

  describe('when typing and matches exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should show suggestions', () => {
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });

    it('should not focus on any suggestion', () => {
      expectFocusedSuggestion(null);
    });

    it('should hide suggestions when Escape is pressed', () => {
      clickEscape();
      expectSuggestions([]);
    });

    it('should clear the input when Escape is pressed again', () => {
      clickEscape();
      clickEscape();
      expectInputValue('');
    });

    it('should hide suggestions when input is blurred', () => {
      blurInput();
      expectSuggestions([]);
    });

    it('should show suggestions when input is focused again', () => {
      blurInput();
      focusInput();
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });

    it('should revert input value when Escape is pressed after Up/Down interaction', () => {
      clickDown();
      clickEscape();
      expectInputValue('p');
    });

    it('should update input value when suggestion is clicked', () => {
      clickSuggestion(1);
      expectInputValue('PHP');
    });

    it('should focus on suggestion when mouse enters it', () => {
      mouseEnterSuggestion(2);
      expectFocusedSuggestion('Python');
    });

    it('should not have focused suggestions when mouse leaves a suggestion', () => {
      mouseEnterSuggestion(2);
      mouseLeaveSuggestion(2);
      expectFocusedSuggestion(null);
    });
  });

  describe('when typing and matches do not exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('z');
    });

    it('should not show suggestions', () => {
      expectSuggestions([]);
    });

    it('should clear the input when Escape is pressed', () => {
      clickEscape();
      expectInputValue('');
    });
  });

  describe('when pressing Down', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should show suggestions with no focused suggestion, if they are hidden', () => {
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
      focusAndSetInputValue('p');
    });

    it('should show suggestions with no focused suggestion, if they are hidden', () => {
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

  describe('when pressing Enter', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should hide suggestions if there is a focused suggestion', () => {
      clickDown();
      clickEnter();
      expectSuggestions([]);
    });

    it('should not hide suggestions if there is no focused suggestion', () => {
      clickEnter();
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });
  });

  describe('when pressing Escape', () => {
    it('should clear the input if suggestions are hidden and never been shown before', () => {
      focusAndSetInputValue('z');
      clickEscape();
      expectInputValue('');
    });

    it('should clear the input if suggestions are hidden but were shown before', () => {
      focusAndSetInputValue('p');
      focusAndSetInputValue('pz');
      clickEscape();
      expectInputValue('');
    });
  });

  describe('when suggestion is clicked', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      clickSuggestion(1);
    });

    it('should hide suggestions', () => {
      expectSuggestions([]);
    });
  });

  describe('getSuggestionValue', () => {
    beforeEach(() => {
      getSuggestionValue.reset();
      focusAndSetInputValue('r');
    });

    it('should be called once with the right parameters when Up is pressed', () => {
      clickUp();
      expect(getSuggestionValue).to.have.been.calledOnce;
      expect(getSuggestionValue).to.have.been.calledWithExactly({ name: 'Ruby', year: 1995 });
    });

    it('should be called once with the right parameters when Down is pressed', () => {
      clickDown();
      expect(getSuggestionValue).to.have.been.calledOnce;
      expect(getSuggestionValue).to.have.been.calledWithExactly({ name: 'Ruby', year: 1995 });
    });

    it('should be called once with the right parameters when suggestion is clicked', () => {
      clickSuggestion(0);
      expect(getSuggestionValue).to.have.been.calledOnce;
      expect(getSuggestionValue).to.have.been.calledWithExactly({ name: 'Ruby', year: 1995 });
    });
  });

  describe('renderSuggestion', () => {
    beforeEach(() => {
      renderSuggestion.reset();
      focusAndSetInputValue('r');
    });

    it('return value should be used to render suggestions', () => {
      const firstSuggestion = getSuggestion(0);

      expect(stripReactAttributes(firstSuggestion.innerHTML)).to.equal('<strong>R</strong><span>uby</span>');
    });

    it('should be called once per suggestion', () => {
      expect(renderSuggestion).to.have.been.calledOnce;
    });

    it('should be called with the right parameters', () => {
      expect(renderSuggestion).to.have.been.calledWithExactly({ name: 'Ruby', year: 1995 }, 'r', null);
      renderSuggestion.reset();
      clickDown();
      expect(renderSuggestion).to.have.been.calledWithExactly({ name: 'Ruby', year: 1995 }, 'Ruby', 'r');
    });
  });

  describe('inputProps.onChange', () => {
    beforeEach(() => {
      focusAndSetInputValue('c');
      onChange.reset();
    });

    it('should be called once with the right parameters when user types', () => {
      focusAndSetInputValue('c+');
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(eventInstance, {
        newValue: 'c+',
        method: 'type'
      });
    });

    it('should be called once with the right parameters when pressing Down focuses on a suggestion which differs from input value', () => {
      clickDown();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(eventInstance, {
        newValue: 'C',
        method: 'down'
      });
    });

    it('should be called once with the right parameters when pressing Up focuses on a suggestion which differs from input value', () => {
      clickUp();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(eventInstance, {
        newValue: 'Clojure',
        method: 'up'
      });
    });

    it('should be called once with the right parameters when Escape is pressed and suggestions are hidden', () => {
      clickEscape();
      clickEscape();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(eventInstance, {
        newValue: '',
        method: 'escape'
      });
    });

    it('should be called once with the right parameters when suggestion which differs from input value is clicked', () => {
      clickSuggestion(2);
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(eventInstance, {
        newValue: 'C++',
        method: 'click'
      });
    });

    it('should not be called when Down is pressed and suggestions are hidden', () => {
      clickEscape();
      clickDown();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when pressing Down focuses on suggestion which value equals to input value', () => {
      focusAndSetInputValue('C++');
      onChange.reset();
      clickDown();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when Up is pressed and suggestions are hidden', () => {
      clickEscape();
      clickUp();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when pressing Up focuses on suggestion which value equals to input value', () => {
      focusAndSetInputValue('C++');
      onChange.reset();
      clickUp();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when Escape is pressed and suggestions are shown', () => {
      clickEscape();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when Escape is pressed, suggestions are hidden, and input is empty', () => {
      focusAndSetInputValue('');
      onChange.reset();
      clickEscape();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when suggestion which value equals to input value is clicked', () => {
      focusAndSetInputValue('C++');
      onChange.reset();
      clickSuggestion(0);
      expect(onChange).not.to.have.been.called;
    });
  });

  describe('shouldRenderSuggestions', () => {
    beforeEach(() => {
      shouldRenderSuggestions.reset();
    });

    it('should be called with the right parameters', () => {
      focusAndSetInputValue('e');
      expect(shouldRenderSuggestions).to.be.calledWithExactly('e');
    });

    it('should show suggestions when `true` is returned', () => {
      focusAndSetInputValue('e');
      expectSuggestions(['Elm']);
    });

    it('should hide suggestions when `false` is returned', () => {
      focusAndSetInputValue(' e');
      expectSuggestions([]);
    });
  });

  describe('onSuggestionSelected', () => {
    beforeEach(() => {
      onSuggestionSelected.reset();
      focusAndSetInputValue('j');
    });

    it('should be called once with the right parameters when suggestion is clicked', () => {
      clickSuggestion(1);
      expect(onSuggestionSelected).to.have.been.calledOnce;
      expect(onSuggestionSelected).to.have.been.calledWithExactly(eventInstance, {
        suggestion: { name: 'Javascript', year: 1995 },
        suggestionValue: 'Javascript',
        method: 'click'
      });
    });

    it('should be called once with the right parameters when Enter is pressed and suggestion is focused', () => {
      clickDown();
      clickEnter();
      expect(onSuggestionSelected).to.have.been.calledOnce;
      expect(onSuggestionSelected).to.have.been.calledWithExactly(eventInstance, {
        suggestion: { name: 'Java', year: 1995 },
        suggestionValue: 'Java',
        method: 'enter'
      });
    });

    it('should not be called when Enter is pressed and there is no focused suggestion', () => {
      clickEnter();
      expect(onSuggestionSelected).not.to.have.been.called;
    });

    it('should not be called when Enter is pressed and there is no focused suggestion after Up/Down interaction', () => {
      clickDown();
      clickDown();
      clickDown();
      clickEnter();
      expect(onSuggestionSelected).not.to.have.been.called;
    });
  });

  describe('aria attributes', () => {
    describe('initially', () => {
      describe('should set input\'s', () => {
        it('role to "combobox"', () => {
          expect(input.getAttribute('role')).to.equal('combobox');
        });

        it('aria-autocomplete to "list"', () => {
          expect(input.getAttribute('aria-autocomplete')).to.equal('list');
        });

        it('aria-expanded to "false"', () => {
          expect(input.getAttribute('aria-expanded')).to.equal('false');
        });

        it('aria-owns', () => {
          expect(input.getAttribute('aria-owns')).to.equal('react-whatever-1');
        });
      });

      describe('should not set input\'s', () => {
        it('aria-activedescendant', () => {
          expect(input.getAttribute('aria-activedescendant')).to.be.null;
        });
      });
    });

    describe('when suggestions are shown', () => {
      beforeEach(() => {
        focusAndSetInputValue('J');
      });

      it('input\'s aria-expanded should be "true"', () => {
        expect(input.getAttribute('aria-expanded')).to.equal('true');
      });

      it('input\'s aria-owns should be equal to suggestions container id', () => {
        expect(input.getAttribute('aria-owns')).to.equal(getSuggestionsContainer().id);
      });

      it('input\'s aria-activedescendant should be equal to the focused suggestion id when using keyboard', () => {
        clickDown();
        expect(input.getAttribute('aria-activedescendant')).to.equal(getSuggestion(0).id);
        clickDown();
        expect(input.getAttribute('aria-activedescendant')).to.equal(getSuggestion(1).id);
        clickDown();
        expect(input.getAttribute('aria-activedescendant')).to.be.null;
      });

      it('input\'s aria-activedescendant should be equal to the focused suggestion id when using mouse', () => {
        mouseEnterSuggestion(0);
        expect(input.getAttribute('aria-activedescendant')).to.equal(getSuggestion(0).id);
        mouseLeaveSuggestion(0);
        expect(input.getAttribute('aria-activedescendant')).to.be.null;
      });

      it('suggestions container role should be "listbox"', () => {
        expect(getSuggestionsContainer().getAttribute('role')).to.equal('listbox');
      });

      it('suggestions\' role should be "option"', () => {
        expect(getSuggestion(0).getAttribute('role')).to.equal('option');
        expect(getSuggestion(1).getAttribute('role')).to.equal('option');
      });
    });
  });
});
