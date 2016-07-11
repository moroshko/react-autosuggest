import React from 'react';
import TestUtils from 'react-addons-test-utils';
import { expect } from 'chai';
import {
  init,
  eventInstance,
  getInnerHTML,
  expectInputAttribute,
  expectInputValue,
  getSuggestionsContainer,
  getSuggestion,
  expectSuggestions,
  expectFocusedSuggestion,
  mouseEnterSuggestion,
  mouseLeaveSuggestion,
  clickSuggestion,
  focusInput,
  blurInput,
  clickEscape,
  clickEnter,
  clickDown,
  clickUp,
  focusAndSetInputValue,
  isInputFocused,
  clearEvents,
  getEvents
} from '../helpers';
import AutosuggestApp, {
  getSuggestionValue,
  renderSuggestion,
  onChange,
  onBlur,
  shouldRenderSuggestions,
  onSuggestionSelected,
  onSuggestionsUpdateRequested,
  setSelectFirstSuggestion
} from './AutosuggestApp';

describe('Plain list Autosuggest', () => {
  beforeEach(() => {
    const app = TestUtils.renderIntoDocument(React.createElement(AutosuggestApp));
    const container = TestUtils.findRenderedDOMComponentWithClass(app, 'react-autosuggest__container');
    const input = TestUtils.findRenderedDOMComponentWithTag(app, 'input');

    init({ app, container, input });
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

  describe('when typing and matches exist (when selectFirstSuggestion is true)', () => {
    before(() => {
      setSelectFirstSuggestion(true);
    });

    after(() => {
      setSelectFirstSuggestion(false);
    });

    beforeEach(() => {
      onSuggestionSelected.reset();
      focusAndSetInputValue('p');
    });

    it('should focus first suggestion', () => {
      expectFocusedSuggestion('Perl');
    });

    it('should hide suggestions when Escape is pressed', () => {
      clickEscape();
      expectSuggestions([]);
    });

    it('should hide suggestions when input is blurred', () => {
      blurInput();
      expectSuggestions([]);
    });

    it('should show suggestions', () => {
      expectSuggestions(['Perl', 'PHP', 'Python']);
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

    it('should show suggestions when input is focused again', () => {
      blurInput();
      focusInput();
      expectSuggestions(['Perl', 'PHP', 'Python']);
    });

    it('should focus first suggestion when input is focused again', () => {
      blurInput();
      focusInput();
      expectFocusedSuggestion('Perl');
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

    it('should hide suggestions when pressing Enter after a mouse focuses a suggestion', () => {
      mouseEnterSuggestion(2);
      expectFocusedSuggestion('Python');
      clickEnter();
      expectSuggestions([]);
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

    it('should not focus suggestions', () => {
      expectFocusedSuggestion(null);
    });

    it('should clear the input when Escape is pressed', () => {
      clickEscape();
      expectInputValue('');
    });
  });

  describe('when typing and matches do not exist (when selectFirstSuggestion is true)', () => {
    before(() => {
      setSelectFirstSuggestion(true);
    });

    after(() => {
      setSelectFirstSuggestion(false);
    });

    beforeEach(() => {
      focusAndSetInputValue('z');
    });

    it('should not show suggestions', () => {
      expectSuggestions([]);
    });

    it('should not focus suggestions', () => {
      expectFocusedSuggestion(null);
    });

    it('should clear the input when Escape is pressed', () => {
      clickEscape();
      expectInputValue('');
    });

    it('should not error when Enter is pressed', () => {
      clickEnter();
      expectInputValue('z');
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

    describe('when pressing down', () => {
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

  describe('when pressing Down (when selectFirstSuggestion is true)', () => {
    before(() => {
      setSelectFirstSuggestion(true);
    });

    after(() => {
      setSelectFirstSuggestion(false);
    });

    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should show suggestions with no focused suggestion, if they are hidden', () => {
      clickEscape();
      clickDown();
      expectSuggestions(['Perl', 'PHP', 'Python']);
      expectFocusedSuggestion(null);
    });

    it('should focus on the second suggestion (first was selected on input)', () => {
      clickDown();
      expectFocusedSuggestion('PHP');
    });

    it('should focus on the next suggestion', () => {
      clickDown(2);
      expectFocusedSuggestion('Python');
    });

    it('should not focus on any suggestion after reaching the last suggestion', () => {
      clickDown(3);
      expectFocusedSuggestion(null);
    });

    it('should focus on the first suggestion again', () => {
      clickDown(4);
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

  describe('when pressing Up (when selectFirstSuggestion is true)', () => {
    before(() => {
      setSelectFirstSuggestion(true);
    });

    after(() => {
      setSelectFirstSuggestion(false);
    });

    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should show suggestions with no focused suggestion, if they are hidden', () => {
      clickEscape();
      clickUp();
      expectSuggestions(['Perl', 'PHP', 'Python']);
      expectFocusedSuggestion(null);
    });

    it('should focus on the input field', () => {
      clickUp();
      expectFocusedSuggestion(null);
    });

    it('should focus on the last suggestion', () => {
      clickUp(2);
      expectFocusedSuggestion('Python');
    });

    it('should focus on the second to last suggestion', () => {
      clickUp(3);
      expectFocusedSuggestion('PHP');
    });

    it('should focus on the first suggestion again', () => {
      clickUp(4);
      expectFocusedSuggestion('Perl');
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

    it('should hide suggestions if there is no focused suggestion', () => {
      clickEnter();
      expectSuggestions([]);
    });
  });

  describe('when pressing Enter and selectFirstSuggestion is true', () => {
    before(() => {
      setSelectFirstSuggestion(true);
    });

    after(() => {
      setSelectFirstSuggestion(false);
    });

    beforeEach(() => {
      focusAndSetInputValue('p');
    });

    it('should hide suggestions since the first suggestion is focused', () => {
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

  describe('when pressing Escape and selectFirstSuggestion is true', () => {
    before(() => {
      setSelectFirstSuggestion(true);
    });

    after(() => {
      setSelectFirstSuggestion(false);
    });

    it('should reset the input if suggestions are hidden and never been shown before', () => {
      focusAndSetInputValue('z');
      clickEscape();
      expectInputValue('');
    });

    it('should reset the input if suggestions are hidden but were shown before', () => {
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

  describe('getSuggestionValue when selectFirstSuggestion is true', () => {
    before(() => {
      setSelectFirstSuggestion(true);
    });

    after(() => {
      setSelectFirstSuggestion(false);
    });

    beforeEach(() => {
      focusAndSetInputValue('p');
      getSuggestionValue.reset();
    });

    it('should not be called when Up is pressed (goes to input field)', () => {
      clickUp();
      expect(getSuggestionValue).not.to.have.been.called;
    });

    it('should be called once with the right parameters when Down is pressed', () => {
      clickDown();
      expect(getSuggestionValue).to.have.been.calledOnce;
      expect(getSuggestionValue).to.have.been.calledWithExactly({ name: 'PHP', year: 1995 });
    });

    it('should be called once with the right parameters when suggestion is clicked', () => {
      clickSuggestion(2);
      expect(getSuggestionValue).to.have.been.calledOnce;
      expect(getSuggestionValue).to.have.been.calledWithExactly({ name: 'Python', year: 1991 });
    });
  });

  describe('renderSuggestion', () => {
    beforeEach(() => {
      renderSuggestion.reset();
      focusAndSetInputValue('r');
    });

    it('should be called with the right parameters', () => {
      expect(renderSuggestion).to.have.been.calledWithExactly({ name: 'Ruby', year: 1995 }, { value: 'r', valueBeforeUpDown: null });
      renderSuggestion.reset();
      clickDown();
      expect(renderSuggestion).to.have.been.calledWithExactly({ name: 'Ruby', year: 1995 }, { value: 'Ruby', valueBeforeUpDown: 'r' });
    });

    it('should be called once per suggestion', () => {
      expect(renderSuggestion).to.have.been.calledOnce;
    });

    it('return value should be used to render suggestions', () => {
      const firstSuggestion = getSuggestion(0);

      expect(getInnerHTML(firstSuggestion)).to.equal('<strong>R</strong><span>uby</span>');
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

    it('should not call onChange for Enter event since value did not change', () => {
      clickDown();
      onChange.reset();
      clickEnter();
      expect(onChange).not.to.have.been.called;
    });
  });

  describe('inputProps.onChange with selectFirstSuggestion', () => {
    before(() => {
      setSelectFirstSuggestion(true);
    });

    after(() => {
      setSelectFirstSuggestion(false);
    });

    beforeEach(() => {
      onSuggestionSelected.reset();
      focusAndSetInputValue('p');
      onChange.reset();
    });

    it('should be called with the right parameters when user types', () => {
      focusAndSetInputValue('c');
      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWith(eventInstance, {
        newValue: 'c',
        method: 'type'
      });
    });

    it('should be called once with the right parameters when Enter is pressed', () => {
      clickEnter();
      expect(onSuggestionSelected).to.have.been.calledOnce;
      expect(onSuggestionSelected).to.have.been.calledWithExactly(eventInstance, {
        suggestion: { name: 'Perl', year: 1987 },
        suggestionValue: 'Perl',
        sectionIndex: null,
        method: 'enter'
      });

      expect(onChange).to.have.been.calledOnce;
      expect(onChange).to.be.calledWith(eventInstance, {
        newValue: 'Perl',
        method: 'enter'
      });
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
        sectionIndex: null,
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
        sectionIndex: null,
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

    it('should be called after inputProps.onChange when suggestion is clicked', () => {
      onChange.reset();
      clearEvents();
      clickSuggestion(1);
      expect(getEvents()).to.deep.equal(['onChange', 'onSuggestionSelected']);
    });
  });

  describe('onSuggestionsUpdateRequested', () => {
    it('should be called once with the right parameters when user types', () => {
      onSuggestionsUpdateRequested.reset();
      focusAndSetInputValue('j');
      expect(onSuggestionsUpdateRequested).to.have.been.calledOnce;
      expect(onSuggestionsUpdateRequested).to.have.been.calledWithExactly({ value: 'j', reason: 'type' });
    });

    it('should be called once with the right parameters when suggestion is clicked', () => {
      focusAndSetInputValue('j');
      onSuggestionsUpdateRequested.reset();
      clickSuggestion(1);
      expect(onSuggestionsUpdateRequested).to.have.been.calledOnce;
      expect(onSuggestionsUpdateRequested).to.have.been.calledWithExactly({ value: 'Javascript', reason: 'click' });
    });

    it('should be called once with the right parameters when Enter is pressed and suggestion is focused', () => {
      focusAndSetInputValue('j');
      clickDown();
      onSuggestionsUpdateRequested.reset();
      clickEnter();
      expect(onSuggestionsUpdateRequested).to.have.been.calledOnce;
      expect(onSuggestionsUpdateRequested).to.have.been.calledWithExactly({ value: 'Java', reason: 'enter' });
    });

    it('should be called once with the right parameters when input is blurred, user interacted with Up/Down, and the value before Up/Down is not equal to current input value', () => {
      focusAndSetInputValue('j');
      clickDown();
      onSuggestionsUpdateRequested.reset();
      blurInput();
      expect(onSuggestionsUpdateRequested).to.have.been.calledOnce;
      expect(onSuggestionsUpdateRequested).to.have.been.calledWithExactly({ value: 'Java', reason: 'blur' });
    });

    it('should not be called when Escape is pressed and suggestions are hidden and shouldRenderSuggestions returns `false` for empty value', () => {
      focusAndSetInputValue('jr');
      onSuggestionsUpdateRequested.reset();
      clickEscape();
      expect(onSuggestionsUpdateRequested).not.to.have.been.called;
    });

    it('should not be called when Up/Down is pressed', () => {
      focusAndSetInputValue('j');
      onSuggestionsUpdateRequested.reset();
      clickDown();
      clickDown();
      clickUp();
      expect(onSuggestionsUpdateRequested).not.to.have.been.called;
    });

    it('should not be called when Enter is pressed and there is no focused suggestion', () => {
      focusAndSetInputValue('j');
      onSuggestionsUpdateRequested.reset();
      clickEnter();
      expect(onSuggestionsUpdateRequested).not.to.have.been.called;
    });

    it('should not be called when Enter is pressed and there is no focused suggestion after Up/Down interaction', () => {
      focusAndSetInputValue('j');
      onSuggestionsUpdateRequested.reset();
      clickDown();
      clickDown();
      clickDown();
      clickEnter();
      expect(onSuggestionsUpdateRequested).not.to.have.been.called;
    });

    it('should not be called when input is blurred and user did not interact with Up/Down', () => {
      focusAndSetInputValue('j');
      onSuggestionsUpdateRequested.reset();
      blurInput();
      expect(onSuggestionsUpdateRequested).not.to.have.been.called;
    });

    it('should not be called when input is blurred, user interacted with Up/Down, but the value before Up/Down is equal to current input value', () => {
      focusAndSetInputValue('Java');
      clickDown();
      onSuggestionsUpdateRequested.reset();
      blurInput();
      expect(onSuggestionsUpdateRequested).not.to.have.been.called;
    });

    it('should not be called when Escape is pressed and suggestions are shown', () => {
      focusAndSetInputValue('j');
      onSuggestionsUpdateRequested.reset();
      clickEscape();
      expect(onSuggestionsUpdateRequested).not.to.have.been.called;
    });

    it('should not be called when shouldRenderSuggestions returns `false`', () => {
      onSuggestionsUpdateRequested.reset();
      focusAndSetInputValue(' ');
      expect(onSuggestionsUpdateRequested).not.to.have.been.called;
    });
  });

  describe('when focusInputOnSuggestionClick is true', () => {
    beforeEach(() => {
      onBlur.reset();
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
      expect(onBlur).to.have.been.calledWithExactly(eventInstance);
    });
  });

  describe('aria attributes', () => {
    describe('initially', () => {
      describe('should set input\'s', () => {
        it('role to "combobox"', () => {
          expectInputAttribute('role', 'combobox');
        });

        it('aria-autocomplete to "list"', () => {
          expectInputAttribute('aria-autocomplete', 'list');
        });

        it('aria-expanded to "false"', () => {
          expectInputAttribute('aria-expanded', 'false');
        });

        it('aria-owns', () => {
          expectInputAttribute('aria-owns', 'react-whatever-1');
        });
      });

      describe('should not set input\'s', () => {
        it('aria-activedescendant', () => {
          expectInputAttribute('aria-activedescendant', null);
        });
      });
    });

    describe('when suggestions are shown', () => {
      beforeEach(() => {
        focusAndSetInputValue('J');
      });

      it('input\'s aria-expanded should be "true"', () => {
        expectInputAttribute('aria-expanded', 'true');
      });

      it('input\'s aria-owns should be equal to suggestions container id', () => {
        expectInputAttribute('aria-owns', getSuggestionsContainer().id);
      });

      it('input\'s aria-activedescendant should be equal to the focused suggestion id when using keyboard', () => {
        clickDown();
        expectInputAttribute('aria-activedescendant', getSuggestion(0).id);
        clickDown();
        expectInputAttribute('aria-activedescendant', getSuggestion(1).id);
        clickDown();
        expectInputAttribute('aria-activedescendant', null);
      });

      it('input\'s aria-activedescendant should be equal to the focused suggestion id when using mouse', () => {
        mouseEnterSuggestion(0);
        expectInputAttribute('aria-activedescendant', getSuggestion(0).id);
        mouseLeaveSuggestion(0);
        expectInputAttribute('aria-activedescendant', null);
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
