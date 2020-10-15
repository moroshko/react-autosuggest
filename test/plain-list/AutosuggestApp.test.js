import React from 'react';
import TestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import {
  init,
  syntheticEventMatcher,
  getInnerHTML,
  expectInputAttribute,
  expectInputValue,
  getSuggestionsList,
  getSuggestion,
  expectContainerAttribute,
  expectInputReferenceToBeSet,
  expectSuggestions,
  expectHighlightedSuggestion,
  expectLetBrowserHandleKeyDown,
  expectDontLetBrowserHandleKeyDown,
  getSuggestionsContainerAttribute,
  mouseEnterSuggestion,
  mouseLeaveSuggestion,
  clickSuggestion,
  clickSuggestionsContainer,
  dragSuggestionOut,
  dragSuggestionOutTouch,
  focusInput,
  blurInput,
  clickEscape,
  clickEnter,
  clickDown,
  clickUp,
  setInputValue,
  focusAndSetInputValue,
  isInputFocused,
  clearEvents,
  getEvents,
  mouseUpDocument,
  dragSuggestionOutAndIn,
  unmountApp
} from '../helpers';
import AutosuggestApp, {
  getSuggestionValue,
  renderSuggestion,
  onChange,
  onFocus,
  onBlur,
  shouldRenderSuggestions,
  onSuggestionsFetchRequested,
  onSuggestionsClearRequested,
  onSuggestionSelected,
  onSuggestionHighlighted
} from './AutosuggestApp';

describe('Default Autosuggest', () => {
  beforeEach(() => {
    init(TestUtils.renderIntoDocument(<AutosuggestApp />));
  });

  describe('initially', () => {
    describe('should render an input and set its:', () => {
      it('id', () => {
        expectInputAttribute('id', 'my-awesome-autosuggest');
      });

      it('placeholder', () => {
        expectInputAttribute('placeholder', 'Type a programming language');
      });

      it('type', () => {
        expectInputAttribute('type', 'search');
      });

      it('value', () => {
        expectInputValue('');
      });
    });

    it('should not show suggestions', () => {
      expectSuggestions([]);
    });

    it('should set the input reference', () => {
      expectInputReferenceToBeSet();
    });
  });

  describe('when input field is focused and empty', () => {
    beforeEach(() => {
      focusInput();
      clearEvents();
    });

    it('should let browser handle ArrowDown', () => {
      clickDown();
      expectLetBrowserHandleKeyDown();
    });

    it('should let browser handle ArrowUp', () => {
      clickUp();
      expectLetBrowserHandleKeyDown();
    });
  });

  describe('when typing and matches exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should show suggestions', () => {
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });

    it('should not highlight any suggestion', () => {
      expectHighlightedSuggestion(null);
    });

    it('should hide suggestions when Escape is pressed', () => {
      clickEscape();
      expectSuggestions([]);
    });

    it('should not clear the input when Escape is pressed', () => {
      clickEscape();
      expectInputValue('p');
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

    it('should highlight a suggestion when mouse enters it', () => {
      mouseEnterSuggestion(2);
      expectHighlightedSuggestion('Python');
    });

    it('should not have highlighted suggestions when mouse leaves a suggestion', () => {
      mouseEnterSuggestion(2);
      mouseLeaveSuggestion(2);
      expectHighlightedSuggestion(null);
    });

    it('should keep the focus on input when suggestions container is clicked', () => {
      clickSuggestionsContainer();
      expect(isInputFocused()).to.equal(true);
    });

    it('shoud reset the highlighted suggestion when input value changes', () => {
      clickDown();
      setInputValue('Per');
      expectHighlightedSuggestion(null);
    });

    it('should not let browser handle ArrowDown', () => {
      clearEvents();
      clickDown();
      expectDontLetBrowserHandleKeyDown();
    });

    it('should not let browser handle ArrowUp', () => {
      clearEvents();
      clickUp();
      expectDontLetBrowserHandleKeyDown();
    });
  });

  describe('when typing and matches do not exist', () => {
    beforeEach(() => {
      focusAndSetInputValue('z');
    });

    it('should not show suggestions', () => {
      expectSuggestions([]);
    });

    it('should not highlight suggestions', () => {
      expectHighlightedSuggestion(null);
    });

    it('should clear the input when Escape is pressed', () => {
      clickEscape();
      expectInputValue('');
    });

    it('should let browser handle ArrowDown', () => {
      clearEvents();
      clickDown();
      expectLetBrowserHandleKeyDown();
    });

    it('should let browser handle ArrowDown', () => {
      clearEvents();
      clickUp();
      expectLetBrowserHandleKeyDown();
    });
  });

  describe('when typing and matches exist, then mousing over first selection', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      mouseEnterSuggestion(0);
    });

    describe('when pressing up', () => {
      beforeEach(() => {
        clickUp();
      });

      it('should show the original input value', () => {
        expectInputValue('p');
      });
    });
  });

  describe('when typing and matches exist, then mousing over last selection', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
      mouseEnterSuggestion(2);
    });

    describe('when pressing ArrowDown', () => {
      beforeEach(() => {
        clickDown();
      });

      it('should show the original input value', () => {
        expectInputValue('p');
      });
    });
  });

  describe('when pressing Down', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should show suggestions with no highlighted suggestion, if they are hidden', () => {
      clickEscape();
      clickDown();
      expectSuggestions(['Perl', 'PHP', 'Python']);
      expectHighlightedSuggestion(null);
    });

    it('should highlight the first suggestion', () => {
      clickDown();
      expectHighlightedSuggestion('Perl');
    });

    it('should highlight the next suggestion', () => {
      clickDown(2);
      expectHighlightedSuggestion('PHP');
    });

    it('should not highlight any suggestion after reaching the last suggestion', () => {
      clickDown(4);
      expectHighlightedSuggestion(null);
    });

    it('should highlight the first suggestion again', () => {
      clearEvents();
      clickDown(5);
      expectHighlightedSuggestion('Perl');
      expectDontLetBrowserHandleKeyDown();
    });
  });

  describe('when pressing Up', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should show suggestions with no highlighted suggestion, if they are hidden', () => {
      clickEscape();
      clickUp();
      expectSuggestions(['Perl', 'PHP', 'Python']);
      expectHighlightedSuggestion(null);
    });

    it('should highlight the last suggestion', () => {
      clickUp();
      expectHighlightedSuggestion('Python');
    });

    it('should highlight the second last suggestion', () => {
      clickUp(2);
      expectHighlightedSuggestion('PHP');
    });

    it('should not highlight any suggestion after reaching the first suggestion', () => {
      clickUp(4);
      expectHighlightedSuggestion(null);
    });

    it('should highlight the last suggestion again', () => {
      clearEvents();
      clickUp(5);
      expectHighlightedSuggestion('Python');
      expectDontLetBrowserHandleKeyDown();
    });
  });

  describe('when pressing Enter', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should hide suggestions if there is a highlighted suggestion', () => {
      clickDown();
      clickEnter();
      expectSuggestions([]);
    });

    it('should hide suggestions if there is no highlighted suggestion', () => {
      clickEnter();
      expectSuggestions([]);
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

    it('should focus on input if focusInputOnSuggestionClick is true', () => {
      expect(isInputFocused()).to.equal(true);
    });
  });

  // Tests for these bugs
  // https://github.com/moroshko/react-autosuggest/issues/412#issuecomment-318627754
  // https://github.com/moroshko/react-autosuggest/issues/380
  describe('when suggestion is dragged', () => {
    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should keep the focus on input when suggestion is dragged', () => {
      dragSuggestionOut(1);
      expect(isInputFocused()).to.equal(true);
    });

    it('should clear suggestions if input blurred after suggestion drag', () => {
      dragSuggestionOut(1);
      blurInput();
      expectSuggestions([]);
    });

    it('should keep the focus on input when suggestion is dragged on touch devices', () => {
      dragSuggestionOutTouch(1);
      expect(isInputFocused()).to.equal(true);
    });

    it("should select a suggestion if it's dragged and mouse enters back", () => {
      dragSuggestionOutAndIn(1);
      expectInputValue('PHP');
    });

    it('should not focus input on document mouse up', () => {
      mouseUpDocument();
      expect(isInputFocused()).to.equal(false);
    });
  });

  describe('getSuggestionValue', () => {
    beforeEach(() => {
      getSuggestionValue.resetHistory();
      focusAndSetInputValue('r');
    });

    it('should be called once with the right parameters when Up is pressed', () => {
      clickUp();
      expect(getSuggestionValue).to.have.been.calledOnce;
      expect(getSuggestionValue).to.have.been.calledWithExactly({
        name: 'Ruby',
        year: 1995
      });
    });

    it('should be called once with the right parameters when Down is pressed', () => {
      clickDown();
      expect(getSuggestionValue).to.have.been.calledOnce;
      expect(getSuggestionValue).to.have.been.calledWithExactly({
        name: 'Ruby',
        year: 1995
      });
    });

    it('should be called once with the right parameters when suggestion is clicked', () => {
      clickSuggestion(0);
      expect(getSuggestionValue).to.have.been.calledOnce;
      expect(getSuggestionValue).to.have.been.calledWithExactly({
        name: 'Ruby',
        year: 1995
      });
    });

    it('should not be called when input is focused', () => {
      clickDown();
      getSuggestionValue.resetHistory();
      clickUp();
      expect(getSuggestionValue).not.to.have.been.called;
    });
  });

  describe('renderSuggestion', () => {
    beforeEach(() => {
      renderSuggestion.resetHistory();
      focusAndSetInputValue('r');
    });

    it('should be called with the right parameters', () => {
      expect(renderSuggestion).to.have.been.calledWithExactly(
        { name: 'Ruby', year: 1995 },
        { query: 'r', isHighlighted: false }
      );
      renderSuggestion.resetHistory();
      clickDown();
      expect(renderSuggestion).to.have.been.calledWithExactly(
        { name: 'Ruby', year: 1995 },
        { query: 'r', isHighlighted: true }
      );
    });

    it('should be called once per suggestion', () => {
      expect(renderSuggestion).to.have.been.calledOnce;
    });

    it('should be called twice when the highlighted suggestion is changed', () => {
      focusAndSetInputValue('c');
      clickDown();
      renderSuggestion.resetHistory();
      clickDown();
      expect(renderSuggestion).to.have.callCount(2);
    });

    it('return value should be used to render suggestions', () => {
      expect(getInnerHTML(getSuggestion(0))).to.equal(
        '<strong>R</strong><span>uby</span>'
      );
    });

    it('should not change the query when mouse leaves a suggestion', () => {
      clickDown();
      mouseEnterSuggestion(0);
      mouseLeaveSuggestion(0);
      expect(getInnerHTML(getSuggestion(0))).to.equal(
        '<strong>R</strong><span>uby</span>'
      );
    });
  });

  describe('inputProps.onChange', () => {
    beforeEach(() => {
      focusAndSetInputValue('c');
      onChange.resetHistory();
    });

    it('should be called once with the right parameters when user types', () => {
      focusAndSetInputValue('c+');
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(syntheticEventMatcher, {
        newValue: 'c+',
        method: 'type'
      });
    });

    it('should be called once with the right parameters when pressing Down highlight a suggestion which differs from input value', () => {
      clickDown();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(syntheticEventMatcher, {
        newValue: 'C',
        method: 'down'
      });
    });

    it('should be called once with the right parameters when pressing Up highlight a suggestion which differs from input value', () => {
      clickUp();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(syntheticEventMatcher, {
        newValue: 'Clojure',
        method: 'up'
      });
    });

    it('should be called once with the right parameters when Escape is pressed and suggestions are hidden', () => {
      clickEscape();
      clickEscape();
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(syntheticEventMatcher, {
        newValue: '',
        method: 'escape'
      });
    });

    it('should be called once with the right parameters when suggestion which differs from input value is clicked', () => {
      clickSuggestion(2);
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWithExactly(syntheticEventMatcher, {
        newValue: 'C++',
        method: 'click'
      });
    });

    it('should not be called when Down is pressed and suggestions are hidden', () => {
      clickEscape();
      clickDown();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when pressing Down highlight a suggestion which value equals to input value', () => {
      focusAndSetInputValue('C++');
      onChange.resetHistory();
      clickDown();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when Up is pressed and suggestions are hidden', () => {
      clickEscape();
      clickUp();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when pressing Up highlight a suggestion which value equals to input value', () => {
      focusAndSetInputValue('C++');
      onChange.resetHistory();
      clickUp();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when Escape is pressed and suggestions are shown', () => {
      clickEscape();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when Escape is pressed, suggestions are hidden, and input is empty', () => {
      focusAndSetInputValue('');
      onChange.resetHistory();
      clickEscape();
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when suggestion which value equals to input value is clicked', () => {
      focusAndSetInputValue('C++');
      onChange.resetHistory();
      clickSuggestion(0);
      expect(onChange).not.to.have.been.called;
    });

    it('should not be called when Enter is pressed and input value has not changed', () => {
      clickDown();
      onChange.resetHistory();
      clickEnter();
      expect(onChange).not.to.have.been.called;
    });
  });

  describe('inputProps.onFocus', () => {
    beforeEach(() => {
      focusAndSetInputValue('c');
      onFocus.resetHistory();
    });

    it('should not call onFocus when suggestions container is clicked', () => {
      clickSuggestionsContainer();
      expect(onFocus).not.to.have.been.called;
    });
  });

  describe('inputProps.onBlur', () => {
    beforeEach(() => {
      focusAndSetInputValue('c');
      onBlur.resetHistory();
    });

    it('should not call onBlur when suggestions container is clicked', () => {
      clickSuggestionsContainer();
      expect(onBlur).not.to.have.been.called;
    });
  });

  describe('shouldRenderSuggestions', () => {
    beforeEach(() => {
      shouldRenderSuggestions.resetHistory();
    });

    it('should be called with the right parameters', () => {
      focusAndSetInputValue('e');
      expect(shouldRenderSuggestions).to.be.calledWithExactly('e');
    });

    it('should show suggestions when true is returned', () => {
      focusAndSetInputValue('e');
      expectSuggestions(['Elm']);
    });

    it('should hide suggestions when false is returned', () => {
      focusAndSetInputValue(' e');
      expectSuggestions([]);
    });
  });

  describe('onSuggestionSelected', () => {
    beforeEach(() => {
      onSuggestionSelected.resetHistory();
      focusAndSetInputValue('j');
    });

    it('should be called once with the right parameters when suggestion is clicked', () => {
      clickSuggestion(1);
      expect(onSuggestionSelected).to.have.been.calledOnce;
      expect(onSuggestionSelected).to.have.been.calledWithExactly(
        syntheticEventMatcher,
        {
          suggestion: { name: 'JavaScript', year: 1995 },
          suggestionValue: 'JavaScript',
          suggestionIndex: 1,
          sectionIndex: null,
          method: 'click'
        }
      );
    });

    it('should be called once with the right parameters when Enter is pressed and suggestion is highlighted', () => {
      clickDown();
      clickEnter();
      expect(onSuggestionSelected).to.have.been.calledOnce;
      expect(onSuggestionSelected).to.have.been.calledWithExactly(
        syntheticEventMatcher,
        {
          suggestion: { name: 'Java', year: 1995 },
          suggestionValue: 'Java',
          suggestionIndex: 0,
          sectionIndex: null,
          method: 'enter'
        }
      );
    });

    it('should not be called when Enter is pressed and there is no highlighted suggestion', () => {
      clickEnter();
      expect(onSuggestionSelected).not.to.have.been.called;
    });

    it('should not be called when Enter is pressed and there is no highlighted suggestion after Up/Down interaction', () => {
      clickDown();
      clickDown();
      clickDown();
      clickEnter();
      expect(onSuggestionSelected).not.to.have.been.called;
    });

    it('should be called after inputProps.onChange when suggestion is clicked', () => {
      onChange.resetHistory();
      clearEvents();
      clickSuggestion(1);
      expect(
        getEvents().filter(
          event => event === 'onChange' || event === 'onSuggestionSelected'
        )
      ).to.deep.equal(['onChange', 'onSuggestionSelected']);
    });
  });

  describe('onSuggestionHighlighted', () => {
    beforeEach(() => {
      focusAndSetInputValue('j');
      onSuggestionHighlighted.resetHistory();
    });

    it('should be called once with the highlighted suggestion when mouse enters a suggestion', () => {
      mouseEnterSuggestion(0);
      expect(onSuggestionHighlighted).to.have.been.calledOnce;
      expect(onSuggestionHighlighted).to.have.been.calledWithExactly({
        suggestion: { name: 'Java', year: 1995 }
      });
    });

    it('should be called once with null when mouse leaves a suggestion and there is no more highlighted suggestion', () => {
      mouseEnterSuggestion(0);
      onSuggestionHighlighted.resetHistory();
      mouseLeaveSuggestion(0);
      expect(onSuggestionHighlighted).to.have.been.calledOnce;
      expect(onSuggestionHighlighted).to.have.been.calledWithExactly({
        suggestion: null
      });
    });
  });

  describe('onSuggestionsFetchRequested', () => {
    it('should be called once with the right parameters when user types', () => {
      focusInput();
      onSuggestionsFetchRequested.resetHistory();
      setInputValue('j');
      expect(onSuggestionsFetchRequested).to.have.been.calledOnce;
      expect(onSuggestionsFetchRequested).to.have.been.calledWithExactly({
        value: 'j',
        reason: 'input-changed'
      });
    });

    it('should be called once with the right parameters when Up is pressed to reveal suggestions', () => {
      focusAndSetInputValue('j');
      clickSuggestion(1);
      onSuggestionsFetchRequested.resetHistory();
      clickDown();
      expect(onSuggestionsFetchRequested).to.have.been.calledOnce;
      expect(onSuggestionsFetchRequested).to.have.been.calledWithExactly({
        value: 'JavaScript',
        reason: 'suggestions-revealed'
      });
    });

    it('should not be called when input gets focus and shouldRenderSuggestions returns false', () => {
      onSuggestionsFetchRequested.resetHistory();
      focusInput();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when user types and shouldRenderSuggestions returns false', () => {
      focusInput();
      onSuggestionsFetchRequested.resetHistory();
      setInputValue(' ');
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when Down is pressed to highlight the next suggestion', () => {
      focusAndSetInputValue('j');
      onSuggestionsFetchRequested.resetHistory();
      clickDown();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when Up is pressed to highlight the previous suggestion', () => {
      focusAndSetInputValue('j');
      onSuggestionsFetchRequested.resetHistory();
      clickUp();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when input is blurred, user interacted with Up/Down, and the value before Up/Down is not equal to current input value', () => {
      focusAndSetInputValue('j');
      clickDown();
      onSuggestionsFetchRequested.resetHistory();
      blurInput();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when Escape is pressed and suggestions are hidden and shouldRenderSuggestions returns false for empty value', () => {
      focusAndSetInputValue('jr');
      onSuggestionsFetchRequested.resetHistory();
      clickEscape();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when Enter is pressed and there is no highlighted suggestion', () => {
      focusAndSetInputValue('j');
      onSuggestionsFetchRequested.resetHistory();
      clickEnter();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when Enter is pressed and there is no highlighted suggestion after Up/Down interaction', () => {
      focusAndSetInputValue('j');
      onSuggestionsFetchRequested.resetHistory();
      clickDown();
      clickDown();
      clickDown();
      clickEnter();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when input is blurred and user did not interact with Up/Down', () => {
      focusAndSetInputValue('j');
      onSuggestionsFetchRequested.resetHistory();
      blurInput();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when input is blurred, user interacted with Up/Down, but the value before Up/Down is equal to current input value', () => {
      focusAndSetInputValue('Java');
      clickDown();
      onSuggestionsFetchRequested.resetHistory();
      blurInput();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });

    it('should not be called when Escape is pressed to close suggestions', () => {
      focusAndSetInputValue('j');
      onSuggestionsFetchRequested.resetHistory();
      clickEscape();
      expect(onSuggestionsFetchRequested).not.to.have.been.called;
    });
  });

  describe('onSuggestionsClearRequested', () => {
    it('should be called once when input is blurred', () => {
      focusAndSetInputValue('p');
      onSuggestionsClearRequested.resetHistory();
      blurInput();
      expect(onSuggestionsClearRequested).to.have.been.calledOnce;
    });

    it('should be called once when suggestion is clicked', () => {
      focusAndSetInputValue('p');
      onSuggestionsClearRequested.resetHistory();
      clickSuggestion(1);
      expect(onSuggestionsClearRequested).to.have.been.calledOnce;
    });

    it('should be called once when shouldRenderSuggestions returns false', () => {
      focusInput();
      onSuggestionsClearRequested.resetHistory();
      setInputValue(' ');
      expect(onSuggestionsClearRequested).to.have.been.calledOnce;
    });

    it('should be called once when Escape is pressed to close suggestions', () => {
      focusAndSetInputValue('p');
      onSuggestionsClearRequested.resetHistory();
      clickEscape();
      expect(onSuggestionsClearRequested).to.have.been.calledOnce;
    });
  });

  describe('when focusInputOnSuggestionClick is true', () => {
    beforeEach(() => {
      onBlur.resetHistory();
      focusAndSetInputValue('p');
    });

    it('should keep the focus on input when suggestion is clicked', () => {
      clickSuggestion(1);
      expect(isInputFocused()).to.equal(true);
    });

    it('should not call onBlur when suggestion is clicked', () => {
      clickSuggestion(1);
      expect(onBlur).not.to.have.been.called;
    });

    it('should call onBlur once with the right parameters when input is blurred', () => {
      blurInput();
      expect(onBlur).to.have.been.calledOnce;
      expect(onBlur).to.have.been.calledWithExactly(syntheticEventMatcher, {
        highlightedSuggestion: null
      });
    });
  });

  describe('aria attributes', () => {
    describe('initially', () => {
      describe("should set input container's", () => {
        it('role to "combobox"', () => {
          expectContainerAttribute('role', 'combobox');
        });

        it('aria-expanded to "false"', () => {
          expectContainerAttribute('aria-expanded', 'false');
        });

        it('aria-owns', () => {
          expectContainerAttribute('aria-owns', 'react-autowhatever-1');
        });
      });

      describe("should set input's", () => {
        it('aria-autocomplete to "list"', () => {
          expectInputAttribute('aria-autocomplete', 'list');
        });
      });

      describe("should not set input's", () => {
        it('aria-activedescendant', () => {
          expectInputAttribute('aria-activedescendant', null);
        });
      });
    });

    describe('when suggestions are shown', () => {
      beforeEach(() => {
        focusAndSetInputValue('J');
      });

      it('input container\'s aria-expanded should be "true"', () => {
        expectContainerAttribute('aria-expanded', 'true');
      });

      it("input container's aria-owns should be equal to suggestions container id", () => {
        expectContainerAttribute(
          'aria-owns',
          getSuggestionsContainerAttribute('id')
        );
      });

      it("input's aria-activedescendant should be equal to the highlighted suggestion id when using keyboard", () => {
        clickDown();
        expectInputAttribute('aria-activedescendant', getSuggestion(0).id);
        clickDown();
        expectInputAttribute('aria-activedescendant', getSuggestion(1).id);
        clickDown();
        expectInputAttribute('aria-activedescendant', null);
      });

      it("input's aria-activedescendant should be equal to the highlighted suggestion id when using mouse", () => {
        mouseEnterSuggestion(0);
        expectInputAttribute('aria-activedescendant', getSuggestion(0).id);
        mouseLeaveSuggestion(0);
        expectInputAttribute('aria-activedescendant', null);
      });

      it('suggestions list role should be "listbox"', () => {
        expect(getSuggestionsList().getAttribute('role')).to.equal('listbox');
      });

      it('suggestions\' role should be "option"', () => {
        expect(getSuggestion(0).getAttribute('role')).to.equal('option');
        expect(getSuggestion(1).getAttribute('role')).to.equal('option');
      });
    });
  });

  describe('on unmount', () => {
    it('should not throw', () => {
      // pretty dump test since we can't check event listeners on document directly
      // at least we know it doesn't throw on unmount
      expect(unmountApp).to.not.throw();
    });
  });
});
