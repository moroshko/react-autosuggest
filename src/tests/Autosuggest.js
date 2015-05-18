'use strict';

import proxyquire from 'proxyquire';
import chai, { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import React from 'react/addons';
import SyntheticEvent from 'react/lib/SyntheticEvent';

chai.use(sinonChai);

const Autosuggest = proxyquire('../Autosuggest', { debounce: fn => fn });
const TestUtils = React.addons.TestUtils;
const Simulate = TestUtils.Simulate;
const SimulateNative = TestUtils.SimulateNative;
const suburbObjects = [
  { suburb: 'Cheltenham', postcode: '3192' },
  { suburb: 'Mill Park', postcode: '3083' },
  { suburb: 'Mordialloc', postcode: '3195' },
  { suburb: 'Nunawading', postcode: '3131' }
];
const stringSuburbs = suburbObjects.map(suburbObj => suburbObj.suburb);
const reactAttributesRegex = / data-react[-\w]+="[^"]+"/g;
let autosuggest, input, suggestions;
const onSuggestionSelected = sinon.spy();
const onSuggestionFocused = sinon.spy();
const onSuggestionUnfocused = sinon.spy();
const onChange = sinon.spy();
const onBlur = sinon.spy();
const getSuburbs = sinon.spy(getSuburbStrings);

function getSuburbStrings(input, callback) {
  const regex = new RegExp('^' + input, 'i');

  callback(null, stringSuburbs.filter(suburb => regex.test(suburb)));
}

function getSuburbObjects(input, callback) {
  const regex = new RegExp('^' + input, 'i');

  callback(null, suburbObjects.filter(suburbObj => regex.test(suburbObj.suburb)));
}

function getStaticSuburbs(input, callback) {
  callback(null, [
    { suburb: 'Mill Park', postcode: '3083' },
    { suburb: 'Nunawading', postcode: '3131' }
  ]);
}

function getMultipleSectionsSuburbs(input, callback) {
  callback(null, [{
    suggestions: ['Forest Hill', 'Flinders Street']
  }, {
    sectionName: 'Second section',
    suggestions: ['Hobart', 'Adelaide']
  }, {
    sectionName: 'Third section',
    suggestions: ['Dandenong']
  }]);
}

function renderSuburbString(suburb, input) {
  return (
    <span><strong>{suburb.slice(0, input.length)}</strong>{suburb.slice(input.length)}</span>
  );
}

function renderSuburbObject(suburbObj, input) {
  return (
    <span><strong>{suburbObj.suburb.slice(0, input.length)}</strong>{suburbObj.suburb.slice(input.length)} VIC {suburbObj.postcode}</span>
  );
}

function getSuburbObjectValue(suburbObj) {
  return suburbObj.suburb + ' VIC ' + suburbObj.postcode;
}

function showWhen(input) {
  return input.length >= 3;
}

// See: http://stackoverflow.com/q/28979533/247243
function stripReactAttributes(html) {
  return html.replace(reactAttributesRegex, '');
}

function setInputValue(value) {
  Simulate.change(input, { target: { value: value } });
}

function mouseDownSuggestion(suggestionIndex) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  Simulate.mouseDown(React.findDOMNode(suggestions[suggestionIndex]));
}

// See: https://github.com/facebook/react/issues/1297
function mouseOver(from, to) {
  SimulateNative.mouseOut(from, { relatedTarget: to });
  SimulateNative.mouseOver(to, { relatedTarget: from });
}

function mouseOverFromInputToSuggestion(suggestionIndex) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  mouseOver(input, React.findDOMNode(suggestions[suggestionIndex]));
}

function mouseOverFromSuggestionToInput(suggestionIndex) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  mouseOver(React.findDOMNode(suggestions[suggestionIndex]), input);
}

function mouseOverBetweenSuggestions(suggestionIndex1, suggestionIndex2) {
  const suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  const suggestion1 = React.findDOMNode(suggestions[suggestionIndex1]);
  const suggestion2 = React.findDOMNode(suggestions[suggestionIndex2]);

  mouseOver(suggestion1, suggestion2);
}

function clickOutside() {
  Simulate.blur(input);
}

function clickEscape() {
  Simulate.keyDown(input, { keyCode: 27 });
}

function clickDown() {
  Simulate.keyDown(input, { keyCode: 40 });
}

function clickUp() {
  Simulate.keyDown(input, { keyCode: 38 });
}

function clickEnter() {
  Simulate.keyDown(input, { keyCode: 13 });
}

function expectInputValue(expectedValue) {
  expect(input.value).to.equal(expectedValue);
}

function expectSuggestions(expectedSuggestions) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  expect(suggestions).to.have.length(expectedSuggestions.length);

  for (let i = 0; i < expectedSuggestions.length; i++) {
    expect(React.findDOMNode(suggestions[i]).textContent).to.equal(expectedSuggestions[i]);
  }
}

function expectFocusedSuggestion(suggestion) {
  const focusedSuggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion--focused');

  if (suggestion === null) {
    expect(focusedSuggestions).to.be.empty;
  } else {
    expect(focusedSuggestions).to.have.length(1);
    expect(React.findDOMNode(focusedSuggestions[0]).textContent).to.equal(suggestion);
  }
}

function expectSections(expectedSections) {
  const sections = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestions-section');

  expect(sections).to.have.length(expectedSections.length);

  for (let i = 0; i < sections.length; i++) {
    const sectionName = TestUtils.scryRenderedDOMComponentsWithClass(sections[i], 'react-autosuggest__suggestions-section-name');

    if (expectedSections[i] === null) {
      expect(sectionName).to.be.empty;
    } else {
      expect(sectionName).to.have.length(1);
      expect(React.findDOMNode(sectionName[0]).textContent).to.equal(expectedSections[i]);
    }
  }
}

function createAutosuggest(Autosuggest) {
  autosuggest = TestUtils.renderIntoDocument(Autosuggest);
  input = React.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input'));
}

describe('Autosuggest', () => {
  describe('isMultipleSections()', () => {
    beforeEach(() => {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
    });

    it('should be multiple sections', () => {
      expect(autosuggest.isMultipleSections([ { suggestions: [] }])).to.be.true;
      expect(autosuggest.isMultipleSections([ { suggestions: ['a', 'b'] }])).to.be.true;
      expect(autosuggest.isMultipleSections([ { sectionName: 'First', suggestions: ['a', 'b'] }])).to.be.true;
    });

    it('should not be multiple sections', () => {
      expect(autosuggest.isMultipleSections(null)).to.be.false;
      expect(autosuggest.isMultipleSections([])).to.be.false;
      expect(autosuggest.isMultipleSections(['a', 'b'])).to.be.false;
      expect(autosuggest.isMultipleSections([ { sectionName: 'First' }])).to.be.false;
      expect(autosuggest.isMultipleSections([ { suburb: 'Mentone', postcode: 3192 }])).to.be.false;
    });
  });


  describe('suggestionsExist()', () => {
    beforeEach(() => {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
    });

    it('should have suggestions', () => {
      expect(autosuggest.suggestionsExist([ { suggestions: ['a'] }])).to.be.true;
      expect(autosuggest.suggestionsExist([ { suburb: 'Mentone', postcode: 3192 }])).to.be.true;
      expect(autosuggest.suggestionsExist([ { sectionName: 'First', suggestions: ['a', 'b'] }])).to.be.true;
      expect(autosuggest.suggestionsExist([ { sectionName: 'First', suggestions: [] }, { sectionName: 'Second', suggestions: ['a'] }])).to.be.true;
    });

    it('should not have suggestions', () => {
      expect(autosuggest.suggestionsExist(null)).to.be.false;
      expect(autosuggest.suggestionsExist([])).to.be.false;
      expect(autosuggest.suggestionsExist([ { suggestions: [] }])).to.be.false;
      expect(autosuggest.suggestionsExist([ { sectionName: 'First', suggestions: [] }, { sectionName: 'Second', suggestions: [] }])).to.be.false;
    });
  });

  describe('that is not configured properly', () => {
    it('should throw an error when "suggestions" are objects but "suggestionRenderer()" isn\'t provided', () => {
      createAutosuggest(<Autosuggest suggestions={getStaticSuburbs} />);
      expect(setInputValue.bind(null, 'a')).to.throw('When <suggestion> is an object, you must implement the suggestionRenderer() function to specify how to render it.');
    });

    it('should throw an error when "suggestions" are objects but "suggestionValue()" isn\'t provided', () => {
      createAutosuggest(<Autosuggest suggestions={getStaticSuburbs} suggestionRenderer={renderSuburbObject} />);
      setInputValue('a');
      expect(mouseDownSuggestion.bind(null, 0)).to.throw('When <suggestion> is an object, you must implement the suggestionValue() function to specify how to set input\'s value when suggestion selected.');
    });
  });

  describe('(basics)', () => {
    describe('with string suggestions', () => {
      beforeEach(() => {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbStrings}
                       inputAttributes={{ id: 'my-autosuggest',
                                          name: 'my-autosuggest-name',
                                          placeholder: 'Enter location...',
                                          className: 'my-sweet-autosuggest',
                                          value: 'my value' }} />
        );
      });

      it('should set input attributes', () => {
        expect(input.id).to.equal('my-autosuggest');
        expect(input.name).to.equal('my-autosuggest-name');
        expect(input.getAttribute('placeholder')).to.equal('Enter location...');
        expect(input.className).to.equal('my-sweet-autosuggest');
      });

      it('should set initial value', () => {
        expectInputValue('my value');
      });

      it('should not show suggestions by default', () => {
        expectSuggestions([]);
      });

      it('should show suggestions when matches exist', () => {
        setInputValue('m');
        expectSuggestions(['Mill Park', 'Mordialloc']);
      });

      it('should not focus on suggestion when suggestions are shown', () => {
        setInputValue('m');
        expectFocusedSuggestion(null);
      });

      it('should show suggestions when case insensitive matches exist', () => {
        setInputValue('NUNA');
        expectSuggestions(['Nunawading']);
      });

      it('should show not suggestions when no matches exist', () => {
        setInputValue('a');
        expectSuggestions([]);
      });

      it('should hide suggestions when ESC is clicked and suggestions are shown', () => {
        setInputValue('m');
        clickEscape();
        expectSuggestions([]);
      });

      it('should clear the input when ESC is clicked and suggestions are not shown', () => {
        setInputValue('m');
        clickEscape();
        clickEscape();
        expectInputValue('');
      });
    });

    describe('with object suggestions', () => {
      beforeEach(() => {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue} />
        );
      });

      it('should show suggestions when matches exist', () => {
        setInputValue('m');
        expectSuggestions(['Mill Park VIC 3083', 'Mordialloc VIC 3195']);
      });
    });
  });

  describe('revealing the suggestions using keyboard', () => {
    beforeEach(() => {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
      setInputValue('m');
      clickEscape();
    });

    it('should show suggestions when Down is pressed', () => {
      clickDown();
      expectSuggestions(['Mill Park', 'Mordialloc']);
      expectFocusedSuggestion(null);
    });

    it('should show suggestions when Up is pressed', () => {
      clickUp();
      expectSuggestions(['Mill Park', 'Mordialloc']);
      expectFocusedSuggestion(null);
    });
  });

  describe('suggestionRenderer', () => {
    describe('with string suggestions', () => {
      beforeEach(() => {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbStrings}
                       suggestionRenderer={renderSuburbString} />
        );
        setInputValue('m');
      });

      it('should use the specified suggestionRenderer function', () => {
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(stripReactAttributes(React.findDOMNode(suggestions[0]).innerHTML)).to.equal('<span><strong>M</strong><span>ill Park</span></span>');
      });
    });

    describe('with object suggestions', () => {
      beforeEach(() => {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue} />
        );
        setInputValue('m');
      });

      it('should use the specified suggestionRenderer function', () => {
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(stripReactAttributes(React.findDOMNode(suggestions[0]).innerHTML)).to.equal('<span><strong>M</strong><span>ill Park</span><span> VIC </span><span>3083</span></span>');
      });
    });
  });

  describe('showWhen', () => {
    beforeEach(() => {
      createAutosuggest(
        <Autosuggest suggestions={getSuburbStrings}
                     showWhen={showWhen} />
      );
    });

    it('should not show suggestions when showWhen returns false', () => {
      setInputValue('m');
      expectSuggestions([]);

      setInputValue('mo');
      expectSuggestions([]);
    });

    it('should show suggestions when showWhen returns true', () => {
      setInputValue('mor');
      expectSuggestions(['Mordialloc']);
    });
  });

  describe('onSuggestionSelected', () => {
    beforeEach(() => {
      onSuggestionSelected.reset();
    });

    describe('with string suggestions', () => {
      beforeEach(() => {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbStrings}
                       onSuggestionSelected={onSuggestionSelected} />
        );
        setInputValue('m');
      });

      it('should be called when suggestion is selected using mouse', () => {
        mouseOverFromInputToSuggestion(1);
        mouseDownSuggestion(1);
        expect(onSuggestionSelected).to.have.been.calledWith('Mordialloc', sinon.match.instanceOf(SyntheticEvent));
      });

      it('should not be called when mouse enters a suggestion', () => {
        mouseOverFromInputToSuggestion(0);
        expect(onSuggestionSelected).not.to.have.been.called;
      });
    });

    describe('with object suggestions', () => {
      beforeEach(() => {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue}
                       onSuggestionSelected={onSuggestionSelected} />
        );
        setInputValue('m');
      });

      it('should be called when suggestion is selected using keyboard', () => {
        clickDown();
        clickEnter();
        expect(onSuggestionSelected).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' }, sinon.match.instanceOf(SyntheticEvent));
      });

      it('should not be called when navigating using keyboard', () => {
        clickDown();
        expect(onSuggestionSelected).not.to.have.been.called;
      });

      it('should not be called if no suggestion is focussed', () => {
        clickEnter();
        expect(onSuggestionSelected).not.to.have.been.called;
      });

      it('should not be called if no suggestion is focussed after Up/Down interaction', () => {
        clickDown();
        clickDown();
        clickDown();
        clickEnter();
        expect(onSuggestionSelected).not.to.have.been.called;
      });
    });
  });

  describe('onSuggestionFocused', () => {
    beforeEach(() => {
      onSuggestionFocused.reset();
      createAutosuggest(
        <Autosuggest suggestions={getSuburbStrings}
                     onSuggestionFocused={onSuggestionFocused} />
      );
      setInputValue('m');
    });

    describe('(mouse interactions)', () => {
      describe('should be called when', () => {
        it('mouse is entering a suggestion', () => {
          mouseOverFromInputToSuggestion(1);
          expect(onSuggestionFocused).to.have.been.calledWith('Mordialloc');
        });
      });
    });

    describe('(keyboard interactions)', () => {
      describe('should be called when', () => {
        it('suggestion focused using Up/Down keys', () => {
          clickDown();
          expect(onSuggestionFocused).to.have.been.calledWith('Mill Park');
        });
      });

      describe('should not be called when', () => {
        it('Up/Down keys are pressed after ESC is pressed', () => {
          clickDown();
          clickEscape();
          onSuggestionFocused.reset();
          clickDown();
          expect(onSuggestionFocused).not.to.have.been.called;
        });

        it('first suggestion is focused and Up key is pressed', () => {
          clickDown();
          onSuggestionFocused.reset();
          clickUp();
          expect(onSuggestionFocused).not.to.have.been.called;
        });

        it('last suggestion is focused and Down key is pressed', () => {
          clickDown();
          clickDown();
          onSuggestionFocused.reset();
          clickDown();
          expect(onSuggestionFocused).not.to.have.been.called;
        });
      });
    });

    describe('(combined interactions)', () => {
      it('should not be called twice if focusing same suggestion with keyboard and then with mouse', () => {
        clickDown();
        expect(onSuggestionFocused).to.have.been.calledWith('Mill Park');
        onSuggestionFocused.reset();
        mouseOverFromInputToSuggestion(0);
        expect(onSuggestionFocused).not.to.have.been.called;
      });
    });
  });

  describe('onSuggestionUnfocused', () => {
    beforeEach(() => {
      onSuggestionUnfocused.reset();
      createAutosuggest(
        <Autosuggest suggestions={getSuburbObjects}
                     suggestionRenderer={renderSuburbObject}
                     suggestionValue={getSuburbObjectValue}
                     onSuggestionUnfocused={onSuggestionUnfocused} />
      );
      setInputValue('m');
    });

    describe('(mouse interactions)', () => {
      describe('should be called when', () => {
        it('mouse is moving between suggestions', () => {
          mouseOverFromInputToSuggestion(0);
          mouseOverBetweenSuggestions(0, 1);
          expect(onSuggestionUnfocused).to.have.been.calledOnce;
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });

        it('mouse is leaving a focused suggestion', () => {
          mouseOverFromInputToSuggestion(0);
          mouseOverFromSuggestionToInput(0);
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });

        it('suggestion is clicked', () => {
          mouseOverFromInputToSuggestion(0);
          mouseDownSuggestion(0);
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });

        it('suggestion is focused and mouse is entering another suggestion', () => {
          clickDown();
          clickDown();
          onSuggestionUnfocused.reset();
          mouseOverFromInputToSuggestion(0);
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mordialloc', postcode: '3195' });
        });

        it('clicking outside and suggestion is focused', () => {
          clickDown();
          clickOutside();
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });
      });

      describe('should not be called when', () => {
        it('suggestion is focused and mouse is entering the same suggestion', () => {
          clickDown();
          mouseOverFromInputToSuggestion(0);
          expect(onSuggestionUnfocused).not.to.have.been.called;
        });

        it('suggestion is focused and mouse is leaving another suggestion', () => {
          mouseOverFromInputToSuggestion(0);
          clickDown();
          onSuggestionUnfocused.reset();
          mouseOverFromSuggestionToInput(0);
          expect(onSuggestionUnfocused).not.to.have.been.called;
        });
      });
    });

    describe('(keyboard interactions)', () => {
      describe('should be called when', () => {
        it('moving between suggestions using Up/Down keys', () => {
          clickDown();
          expect(onSuggestionUnfocused).not.to.have.been.called;
          clickDown();
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });

        it('first suggestion is focused and Up key is pressed', () => {
          clickDown();
          clickUp();
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });

        it('last suggestion is focused and Down key is pressed', () => {
          clickDown();
          clickDown();
          onSuggestionUnfocused.reset();
          clickDown();
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mordialloc', postcode: '3195' });
        });

        it('ESC key pressed and suggestion is focused', () => {
          clickDown();
          clickEscape();
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });

        it('Enter is pressed and suggestion is focused', () => {
          clickDown();
          clickEnter();
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });

        it('input value is changed and suggestion is focused', () => {
          clickDown();
          setInputValue(input.value.slice(0, -1)); // Simulates Backspace
          expect(onSuggestionUnfocused).to.have.been.calledWith({ suburb: 'Mill Park', postcode: '3083' });
        });
      });

      describe('should not be called when', () => {
        it('Up/Down keys are pressed after ESC is pressed', () => {
          clickDown();
          clickEscape();
          onSuggestionUnfocused.reset();
          clickDown();
          expect(onSuggestionUnfocused).not.to.have.been.called;
        });

        it('ESC key pressed and no suggestion focused', () => {
          clickEscape();
          expect(onSuggestionUnfocused).not.to.have.been.called;
        });

        it('clicking outside and no suggestion focused', () => {
          clickDown();
          clickDown();
          clickDown();
          onSuggestionUnfocused.reset();
          clickOutside();
          expect(onSuggestionUnfocused).not.to.have.been.called;
        });

        it('Enter is pressed and no suggestion focused', () => {
          clickEnter();
          expect(onSuggestionUnfocused).not.to.have.been.called;
        });

        it('input value is changed and no suggestion focused', () => {
          clickDown();
          clickDown();
          clickDown();
          onSuggestionUnfocused.reset();
          setInputValue(input.value.slice(0, -1));
          expect(onSuggestionUnfocused).not.to.have.been.called;
        });
      });
    });
  });

  describe('inputAttributes.onChange', () => {
    beforeEach(() => {
      onChange.reset();
      createAutosuggest(
        <Autosuggest suggestions={getSuburbStrings}
                     inputAttributes={{ onChange: onChange }} />
      );
      setInputValue('m');
    });

    describe('should be called when', () => {
      it('user types characters', () => {
        expect(onChange).to.have.been.calledWith('m');
      });

      it('Down key is pressed', () => {
        onChange.reset();
        clickDown();
        expect(onChange).to.have.been.calledWith('Mill Park');
      });

      it('Up key is pressed', () => {
        onChange.reset();
        clickUp();
        expect(onChange).to.have.been.calledWith('Mordialloc');
      });

      it('ESC key is pressed when input is not empty', () => {
        clickEscape();
        onChange.reset();
        clickEscape();
        expect(onChange).to.have.been.calledWith('');
      });

      it('suggestion is clicked', () => {
        onChange.reset();
        mouseDownSuggestion(0);
        expect(onChange).to.have.been.calledWith('Mill Park');
      });
    });

    describe('should not be called when', () => {
      it('ESC key is pressed to hide suggestions', () => {
        onChange.reset();
        clickEscape();
        expect(onChange).not.to.have.been.called;
      });

      it('ESC key is pressed when input is empty', () => {
        setInputValue('');
        onChange.reset();
        clickEscape();
        expect(onChange).not.to.have.been.called;
      });
    });
  });

  describe('inputAttributes.onBlur', () => {
    beforeEach(() => {
      onBlur.reset();
      createAutosuggest(
        <Autosuggest suggestions={getSuburbStrings}
                     inputAttributes={{ onBlur: onBlur }} />
      );
    });

    describe('should be called when', () => {
      it('input is blurred', () => {
        clickOutside();
        expect(onBlur).to.have.been.called;
      });
    });

    describe('should not be called when', () => {
      it('suggestion is clicked', () => {
        setInputValue('m');
        mouseDownSuggestion(0);
        expect(onBlur).not.to.have.been.called;
      });

      it('suggestion is selected by pressing Enter', () => {
        setInputValue('m');
        clickDown();
        clickEnter();
        expect(onBlur).not.to.have.been.called;
      });
    });
  });

  describe('(keyboard interactions)', () => {
    describe('with string suggestions', () => {
      beforeEach(() => {
        createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
        setInputValue('m');
      });

      it('should focus on first suggestion and change input value when Down is pressed', () => {
        clickDown();
        expectFocusedSuggestion('Mill Park');
        expectInputValue('Mill Park');
      });

      it('should focus on next suggestion and change input value when Down is pressed again', () => {
        clickDown();
        clickDown();
        expectFocusedSuggestion('Mordialloc');
        expectInputValue('Mordialloc');
      });

      it('should remove focus from suggestions when last suggestion is focused and Down is pressed', () => {
        clickDown();
        clickDown();
        clickDown();
        expectFocusedSuggestion(null);
        expectInputValue('m');
      });

      it('should hide suggestions and revert back input\'s value when ESC is clicked after Down', () => {
        clickDown();
        clickEscape();
        expectSuggestions([]);
        expectInputValue('m');
      });

      it('should focus on last suggestion and change input value when Up is pressed', () => {
        clickUp();
        expectFocusedSuggestion('Mordialloc');
        expectInputValue('Mordialloc');
      });

      it('should focus on previous suggestion and change input value when Up is pressed again', () => {
        clickUp();
        clickUp();
        expectFocusedSuggestion('Mill Park');
        expectInputValue('Mill Park');
      });

      it('should remove focus from suggestions when first suggestion is focused and Up is pressed', () => {
        clickUp();
        clickUp();
        clickUp();
        expectFocusedSuggestion(null);
        expectInputValue('m');
      });
    });

    describe('with object suggestions', () => {
      beforeEach(() => {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue} />
        );
        setInputValue('m');
      });

      it('should focus on first suggestion and change input value when Down is pressed', () => {
        clickDown();
        expectFocusedSuggestion('Mill Park VIC 3083');
        expectInputValue('Mill Park VIC 3083');
      });
    });
  });

  describe('(mouse interactions)', () => {
    describe('with string suggestions', () => {
      beforeEach(() => {
        createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
        setInputValue('m');
      });

      it('should set input field value when suggestion is clicked', () => {
        mouseDownSuggestion(1);
        expectInputValue('Mordialloc');
      });

      it('should focus on suggestion but not change input\'s value when mouse enters the suggestion', () => {
        mouseOverFromInputToSuggestion(0);
        expectFocusedSuggestion('Mill Park');
        expectInputValue('m');
      });

      it('should not have focused suggestions when mouse leaves the suggestion', () => {
        mouseOverFromInputToSuggestion(0);
        mouseOverFromSuggestionToInput(0);
        expectFocusedSuggestion(null);
      });

      it('should remember focused suggestion when mouse enters suggestion', () => {
        mouseOverFromInputToSuggestion(0);
        clickDown();
        expectFocusedSuggestion('Mordialloc');
        expectInputValue('Mordialloc');
      });
    });

    describe('with object suggestions', () => {
      beforeEach(() => {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue} />
        );
        setInputValue('m');
      });

      it('should set input field value when suggestion is clicked', () => {
        mouseDownSuggestion(0);
        expectInputValue('Mill Park VIC 3083');
      });
    });
  });

  describe('(accessibility attributes)', () => {
    beforeEach(() => {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
    });

    describe('when rendered', () => {
      it('input\'s role should be combobox', () => {
        expect(input.getAttribute('role')).to.equal('combobox');
      });

      it('input\'s aria-autocomplete should be list', () => {
        expect(input.getAttribute('aria-autocomplete')).to.equal('list');
      });

      it('input\'s aria-expanded should be false', () => {
        expect(input.getAttribute('aria-expanded')).to.equal('false');
      });

      it('input\'s aria-activedescendant should not present', () => {
        expect(input.getAttribute('aria-activedescendant')).to.be.null;
      });
    });

    describe('when suggestions appear', () => {
      beforeEach(() => {
        setInputValue('m');
      });

      it('input\'s aria-expanded should be true', () => {
        expect(input.getAttribute('aria-expanded')).to.equal('true');
      });

      it('input\'s aria-expanded should become false when input is cleared', () => {
        setInputValue('');
        expect(input.getAttribute('aria-expanded')).to.equal('false');
      });

      it('input\'s aria-activedescendant should be the id of the focused suggestion when using keyboard', () => {
        clickDown();
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(input.getAttribute('aria-activedescendant')).to.equal(React.findDOMNode(suggestions[0]).id);
      });

      it('input\'s aria-activedescendant should be the id of the focused suggestion when using mouse', () => {
        mouseOverFromInputToSuggestion(0);
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(input.getAttribute('aria-activedescendant')).to.equal(React.findDOMNode(suggestions[0]).id);
      });

      it('suggestion\'s role should be option', () => {
        clickDown();
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(React.findDOMNode(suggestions[0]).getAttribute('role')).to.equal('option');
      });

      it('input\'s aria-owns should be equal to suggestions list\'s id', () => {
        const suggestionsList = TestUtils.findRenderedDOMComponentWithClass(autosuggest, 'react-autosuggest__suggestions');
        expect(input.getAttribute('aria-owns')).to.equal(React.findDOMNode(suggestionsList).id);
      });

      it('suggestions list\'s role should be listbox', () => {
        const suggestionsList = TestUtils.findRenderedDOMComponentWithClass(autosuggest, 'react-autosuggest__suggestions');
        expect(React.findDOMNode(suggestionsList).getAttribute('role')).to.equal('listbox');
      });
    });
  });

  describe('(multiple sections)', () => {
    beforeEach(() => {
      createAutosuggest(<Autosuggest suggestions={getMultipleSectionsSuburbs} />);
      setInputValue('m');
    });

    it('should render section names', () => {
      expectSections([null, 'Second section', 'Third section']);
    });
  });

  describe('(delayed requests)', () => {
    it('should set suggestions', (done) => {
      function getDelayedSuburbStrings(input, callback) {
        switch (input) {
          case 'r':
            setTimeout(() => { callback(null, ['Raglan', 'Riachella', 'Richmond']); }, 20);
            break;
          case 'ri':
            setTimeout(() => { callback(null, ['Riachella', 'Richmond']); }, 50);
            break;
        }
      }
      createAutosuggest(<Autosuggest suggestions={getDelayedSuburbStrings} />);

      setInputValue('r');
      setInputValue('ri');

      setTimeout(() => {
        expectSuggestions(['Riachella', 'Richmond']);
        done();
      }, 51);
    });

    it('should ignore delayed request', (done) => {
      function getDelayedSuburbStrings(input, callback) {
        switch (input) {
          case 'r':
            setTimeout(() => { callback(null, ['Raglan', 'Riachella', 'Richmond']); }, 50);
            break;
          case 'ri':
            setTimeout(() => { callback(null, ['Riachella', 'Richmond']); }, 20);
            break;
        }
      }
      createAutosuggest(<Autosuggest suggestions={getDelayedSuburbStrings} />);

      setInputValue('r');
      setInputValue('ri');

      setTimeout(() => {
        expectSuggestions(['Riachella', 'Richmond']);
        done();
      }, 51);
    });

    it('should ignore request if input is empty', (done) => {
      function getDelayedSuburbStrings(input, callback) {
        setTimeout(() => { callback(null, ['Raglan', 'Riachella', 'Richmond']); }, 50);
      }
      createAutosuggest(<Autosuggest suggestions={getDelayedSuburbStrings} />);

      setInputValue('r');
      setInputValue('');

      setTimeout(() => {
        expectSuggestions([]);
        done();
      }, 51);
    });
  });

  describe('(caching)', () => {
    beforeEach(() => {
      createAutosuggest(<Autosuggest suggestions={getSuburbs} />);
      setInputValue('m');
      getSuburbs.reset();
    });

    describe('should not call suggestions function if', () => {
      it('it was called before with the same input', () => {
        setInputValue('mi');
        getSuburbs.reset();
        setInputValue('m');
        expect(getSuburbs).not.to.have.been.called;
      });

      it('it was called before with the same case insensitive input', () => {
        setInputValue('mi');
        getSuburbs.reset();
        setInputValue('M');
        expect(getSuburbs).not.to.have.been.called;
      });
    });
  });
});
