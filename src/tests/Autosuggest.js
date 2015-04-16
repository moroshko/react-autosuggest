'use strict';

jest.dontMock('../Autosuggest.js');

import React from 'react/addons';
import SyntheticEvent from 'react/lib/SyntheticEvent'
import Autosuggest from '../Autosuggest.js';

let TestUtils = React.addons.TestUtils;
let Simulate = TestUtils.Simulate;
let SimulateNative = TestUtils.SimulateNative;
let suburbObjects = [
  { suburb: 'Cheltenham', postcode: '3192' },
  { suburb: 'Mill Park', postcode: '3083' },
  { suburb: 'Mordialloc', postcode: '3195' },
  { suburb: 'Nunawading', postcode: '3131' }
];
let stringSuburbs = suburbObjects.map( suburbObj => suburbObj.suburb );
let reactAttributesRegex = / data-react[-\w]+="[^"]+"/g;
let autosuggest, input, suggestions;
let onSuggestionSelected = jest.genMockFunction();
let onSuggestionFocused = jest.genMockFunction();
let onSuggestionUnfocused = jest.genMockFunction();

function getSuburbStrings(input, callback) {
  let regex = new RegExp('^' + input, 'i');

  callback(null, stringSuburbs.filter( suburb => regex.test(suburb) ));
}

function getSuburbObjects(input, callback) {
  let regex = new RegExp('^' + input, 'i');

  callback(null, suburbObjects.filter( suburbObj => regex.test(suburbObj.suburb) ));
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
  let suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  let suggestion1 = React.findDOMNode(suggestions[suggestionIndex1]);
  let suggestion2 = React.findDOMNode(suggestions[suggestionIndex2]);

  mouseOver(suggestion1, suggestion2);
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
  expect(input.value).toBe(expectedValue);
}

function expectSuggestions(expectedSuggestions) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  expect(suggestions.length).toBe(expectedSuggestions.length);

  for (let i = 0; i < expectedSuggestions.length; i++) {
    expect(React.findDOMNode(suggestions[i]).textContent).toBe(expectedSuggestions[i]);
  }
}

function expectFocusedSuggestion(suggestion) {
  let focusedSuggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion--focused');

  if (suggestion === null) {
    expect(focusedSuggestions.length).toBe(0);
  } else {
    expect(focusedSuggestions.length).toBe(1);
    expect(React.findDOMNode(focusedSuggestions[0]).textContent).toBe(suggestion);
  }
}

function expectSections(expectedSections) {
  let sections = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestions-section');

  expect(sections.length).toBe(expectedSections.length);

  for (let i = 0; i < sections.length; i++) {
    let sectionName = TestUtils.scryRenderedDOMComponentsWithClass(sections[i], 'react-autosuggest__suggestions-section-name');

    if (expectedSections[i] === null) {
      expect(sectionName.length).toBe(0);
    } else {
      expect(sectionName.length).toBe(1);
      expect(React.findDOMNode(sectionName[0]).textContent).toBe(expectedSections[i]);
    }
  }
}

function createAutosuggest(Autosuggest) {
  autosuggest = TestUtils.renderIntoDocument(Autosuggest);
  input = React.findDOMNode(TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input'));
}

describe('Autosuggest', function() {
  describe('isMultipleSections()', function() {
    beforeEach(function() {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
    });

    it('should be multiple sections', function() {
      expect(autosuggest.isMultipleSections([ { suggestions: [] }])).toBe(true);
      expect(autosuggest.isMultipleSections([ { suggestions: ['a', 'b'] }])).toBe(true);
      expect(autosuggest.isMultipleSections([ { sectionName: 'First', suggestions: ['a', 'b'] }])).toBe(true);
    });

    it('should not be multiple sections', function() {
      expect(autosuggest.isMultipleSections(null)).toBe(false);
      expect(autosuggest.isMultipleSections([])).toBe(false);
      expect(autosuggest.isMultipleSections(['a', 'b'])).toBe(false);
      expect(autosuggest.isMultipleSections([ { sectionName: 'First' }])).toBe(false);
      expect(autosuggest.isMultipleSections([ { suburb: 'Mentone', postcode: 3192 }])).toBe(false);
    });
  });

  describe('suggestionsExist()', function() {
    beforeEach(function() {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
    });

    it('should have suggestions', function() {
      expect(autosuggest.suggestionsExist([ { suggestions: ['a'] }])).toBe(true);
      expect(autosuggest.suggestionsExist([ { suburb: 'Mentone', postcode: 3192 }])).toBe(true);
      expect(autosuggest.suggestionsExist([ { sectionName: 'First', suggestions: ['a', 'b'] }])).toBe(true);
      expect(autosuggest.suggestionsExist([ { sectionName: 'First', suggestions: [] }, { sectionName: 'Second', suggestions: ['a'] }])).toBe(true);
    });

    it('should not have suggestions', function() {
      expect(autosuggest.suggestionsExist(null)).toBe(false);
      expect(autosuggest.suggestionsExist([])).toBe(false);
      expect(autosuggest.suggestionsExist([ { suggestions: [] }])).toBe(false);
      expect(autosuggest.suggestionsExist([ { sectionName: 'First', suggestions: [] }, { sectionName: 'Second', suggestions: [] }])).toBe(false);
    });
  });

  describe('Not configured properly', function() {
    it('should throw an error when "suggestions" are objects but "suggestionRenderer()" isn\'t provided', function() {
      createAutosuggest(<Autosuggest suggestions={getStaticSuburbs} />);
      expect(setInputValue.bind(null, 'a')).toThrow('When <suggestion> is an object, you must implement the suggestionRenderer() function to specify how to render it.');
    });

    it('should throw an error when "suggestions" are objects but "suggestionValue()" isn\'t provided', function() {
      createAutosuggest(<Autosuggest suggestions={getStaticSuburbs} suggestionRenderer={renderSuburbObject} />);
      setInputValue('a');
      expect(mouseDownSuggestion.bind(null, 0)).toThrow('When <suggestion> is an object, you must implement the suggestionValue() function to specify how to set input\'s value when suggestion selected.');
    });
  });

  describe('Basics', function() {
    describe('String suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbStrings}
                       inputAttributes={{ id: 'my-autosuggest',
                                          name: 'my-autosuggest-name',
                                          placeholder: 'Enter location...',
                                          className: 'my-sweet-autosuggest',
                                          value: 'my value' }} />
        );
      });

      it('should set input attributes', function() {
        expect(input.id).toBe('my-autosuggest');
        expect(input.name).toBe('my-autosuggest-name');
        expect(input.getAttribute('placeholder')).toBe('Enter location...');
        expect(input.className).toBe('my-sweet-autosuggest');
      });

      it('should set initial value', function() {
        expectInputValue('my value');
      });

      it('should not show suggestions by default', function() {
        expectSuggestions([]);
      });

      it('should show suggestions when matches exist', function() {
        setInputValue('m');
        expectSuggestions(['Mill Park', 'Mordialloc']);
      });

      it('should not focus on suggestion when suggestions are shown', function() {
        setInputValue('m');
        expectFocusedSuggestion(null);
      });

      it('should show suggestions when case insensitive matches exist', function() {
        setInputValue('NUNA');
        expectSuggestions(['Nunawading']);
      });

      it('should show not suggestions when no matches exist', function() {
        setInputValue('a');
        expectSuggestions([]);
      });

      it('should hide suggestions when ESC is clicked and suggestions are shown', function() {
        setInputValue('m');
        clickEscape();
        expectSuggestions([]);
      });

      it('should clear the input when ESC is clicked and suggestions are not shown', function() {
        setInputValue('m');
        clickEscape();
        clickEscape();
        expectInputValue('');
      });
    });

    describe('Object suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue} />
        );
      });

      it('should show suggestions when matches exist', function() {
        setInputValue('m');
        expectSuggestions(['Mill Park VIC 3083', 'Mordialloc VIC 3195']);
      });
    });
  });

  describe('suggestionRenderer', function() {
    describe('String suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbStrings}
                       suggestionRenderer={renderSuburbString} />
        );
        setInputValue('m');
      });

      it('should use the specified suggestionRenderer function', function() {
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(stripReactAttributes(React.findDOMNode(suggestions[0]).innerHTML)).toBe('<span><strong>M</strong><span>ill Park</span></span>');
      });
    });

    describe('Object suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue} />
        );
        setInputValue('m');
      });

      it('should use the specified suggestionRenderer function', function() {
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(stripReactAttributes(React.findDOMNode(suggestions[0]).innerHTML)).toBe('<span><strong>M</strong><span>ill Park</span><span> VIC </span><span>3083</span></span>');
      });
    });
  });

  describe('showWhen', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest suggestions={getSuburbStrings}
                     showWhen={showWhen} />
      );
    });

    it('should not show suggestions when showWhen returns false', function() {
      setInputValue('m');
      expectSuggestions([]);

      setInputValue('mo');
      expectSuggestions([]);
    });

    it('should show suggestions when showWhen returns true', function() {
      setInputValue('mor');
      expectSuggestions(['Mordialloc']);
    });
  });

  describe('onSuggestionSelected', function() {
    beforeEach(function() {
      onSuggestionSelected.mockClear();
    });

    describe('String suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbStrings}
                       onSuggestionSelected={onSuggestionSelected} />
        );
        setInputValue('m');
      });

      it('should call onSuggestionSelected when suggestion is selected using mouse', function() {
        mouseDownSuggestion(1);
        expect(onSuggestionSelected).toBeCalledWith('Mordialloc', jasmine.any(SyntheticEvent));
      });

      it('should not call onSuggestionSelected when mouse enters a suggestion', function() {
        mouseOverFromInputToSuggestion(0);
        expect(onSuggestionSelected).not.toBeCalled();
      });
    });

    describe('Object suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue}
                       onSuggestionSelected={onSuggestionSelected} />
        );
        setInputValue('m');
      });

      it('should call onSuggestionSelected when suggestion is selected using keyboard', function() {
        clickDown();
        clickEnter();
        expect(onSuggestionSelected).toBeCalledWith({ suburb: 'Mill Park', postcode: '3083' }, jasmine.any(SyntheticEvent));
      });

      it('should not call onSuggestionSelected when navigating using keyboard', function() {
        clickDown();
        expect(onSuggestionSelected).not.toBeCalled();
      });

      it('should not call onSuggestionSelected if no suggestion is focussed', function() {
        clickEnter();
        expect(onSuggestionSelected).not.toBeCalled();
      });

      it('should not call onSuggestionSelected if no suggestion is focussed after Up/Down interaction', function() {
        clickDown();
        clickDown();
        clickDown();
        clickEnter();
        expect(onSuggestionSelected).not.toBeCalled();
      });
    });
  });

  describe('onSuggestionFocused and onSuggestionUnfocused', function() {
    beforeEach(function() {
      onSuggestionFocused.mockClear();
      onSuggestionUnfocused.mockClear();
    });

    describe('String suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbStrings}
                       onSuggestionFocused={onSuggestionFocused}
                       onSuggestionUnfocused={onSuggestionUnfocused} />
        );
        setInputValue('m');
      });

      it('should call onSuggestionFocused when suggestion is focused using mouse', function() {
        mouseOverFromInputToSuggestion(1);
        expect(onSuggestionFocused).toBeCalledWith('Mordialloc');
      });

      it('should call onSuggestionUnfocused when suggestion is unfocused using mouse', function() {
        mouseOverFromInputToSuggestion(0);
        mouseOverBetweenSuggestions(0, 1);
        expect(onSuggestionUnfocused).toBeCalledWith('Mill Park');
      });

      it('should call onSuggestionFocused when suggestion is focused using keyboard', function() {
        clickDown();
        expect(onSuggestionFocused).toBeCalledWith('Mill Park');
      });

      it('should call onSuggestionUnfocused when suggestion is unfocused using up/down keys', function() {
        clickDown();
        clickDown();
        expect(onSuggestionUnfocused).toBeCalledWith('Mill Park');
      });

      it('should call onSuggestionUnfocused when suggestion is unfocused using ESC key', function() {
        clickDown();
        clickEscape();
        expect(onSuggestionUnfocused).toBeCalledWith('Mill Park');
      });
    });

    describe('Object suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue}
                       onSuggestionFocused={onSuggestionFocused}
                       onSuggestionUnfocused={onSuggestionUnfocused} />
        );
        setInputValue('m');
      });

      it('should call onSuggestionFocused when suggestion is focused using mouse', function() {
        mouseOverFromInputToSuggestion(0);
        expect(onSuggestionFocused).toBeCalledWith({ suburb: 'Mill Park', postcode: '3083' });
      });

      it('should call onSuggestionUnfocused when suggestion is unfocused using mouse', function() {
        mouseOverFromInputToSuggestion(0);
        mouseOverBetweenSuggestions(0, 1);
        expect(onSuggestionUnfocused).toBeCalledWith({ suburb: 'Mill Park', postcode: '3083' });
      });

      it('should call onSuggestionFocused when suggestion is focused using keyboard', function() {
        clickDown();
        expect(onSuggestionFocused).toBeCalledWith({ suburb: 'Mill Park', postcode: '3083' });
      });

      it('should call onSuggestionUnfocused when suggestion is unfocused using up/down keys', function() {
        clickDown();
        clickDown();
        expect(onSuggestionUnfocused).toBeCalledWith({ suburb: 'Mill Park', postcode: '3083' });
      });

      it('should call onSuggestionUnfocused when suggestion is unfocused using ESC key', function() {
        clickDown();
        clickEscape();
        expect(onSuggestionUnfocused).toBeCalledWith({ suburb: 'Mill Park', postcode: '3083' });
      });
    });
  });

  describe('Keyboard interactions', function() {
    describe('String suggestions', function() {
      beforeEach(function() {
        createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
        setInputValue('m');
      });

      it('should focus on first suggestion and change input value when Down is clicked', function() {
        clickDown();
        expectFocusedSuggestion('Mill Park');
        expectInputValue('Mill Park');
      });

      it('should focus on next suggestion and change input value when Down is clicked again', function() {
        clickDown();
        clickDown();
        expectFocusedSuggestion('Mordialloc');
        expectInputValue('Mordialloc');
      });

      it('should remove focus from suggestions when last suggestion is focused and Down is clicked', function() {
        clickDown();
        clickDown();
        clickDown();
        expectFocusedSuggestion(null);
        expectInputValue('m');
      });

      it('should hide suggestions and revert back input\'s value when ESC is clicked after Down', function() {
        clickDown();
        clickEscape();
        expectSuggestions([]);
        expectInputValue('m');
      });

      it('should focus on last suggestion and change input value when Up is clicked', function() {
        clickUp();
        expectFocusedSuggestion('Mordialloc');
        expectInputValue('Mordialloc');
      });

      it('should focus on previous suggestion and change input value when Up is clicked again', function() {
        clickUp();
        clickUp();
        expectFocusedSuggestion('Mill Park');
        expectInputValue('Mill Park');
      });

      it('should remove focus from suggestions when first suggestion is focused and Up is clicked', function() {
        clickUp();
        clickUp();
        clickUp();
        expectFocusedSuggestion(null);
        expectInputValue('m');
      });
    });

    describe('Object suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue} />
        );
        setInputValue('m');
      });

      it('should focus on first suggestion and change input value when Down is clicked', function() {
        clickDown();
        expectFocusedSuggestion('Mill Park VIC 3083');
        expectInputValue('Mill Park VIC 3083');
      });
    });
  });

  describe('Revealing the suggestions using keyboard', function() {
    beforeEach(function() {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
      setInputValue('m');
      clickEscape();
    });

    it('should show suggestions when Down is clicked', function() {
      clickDown();
      expectSuggestions(['Mill Park', 'Mordialloc']);
      expectFocusedSuggestion(null);
    });

    it('should show suggestions when Up is clicked', function() {
      clickUp();
      expectSuggestions(['Mill Park', 'Mordialloc']);
      expectFocusedSuggestion(null);
    });
  });

  describe('Mouse interactions', function() {
    describe('String suggestions', function() {
      beforeEach(function() {
        createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
        setInputValue('m');
      });

      it('should set input field value when suggestion is clicked', function() {
        mouseDownSuggestion(1);
        expectInputValue('Mordialloc');
      });

      it('should focus on suggestion but not change input\'s value when mouse enters the suggestion', function() {
        mouseOverFromInputToSuggestion(0);
        expectFocusedSuggestion('Mill Park');
        expectInputValue('m');
      });

      it('should not have focused suggestions when mouse leaves the suggestion', function() {
        mouseOverFromInputToSuggestion(0);
        mouseOverFromSuggestionToInput(0);
        expectFocusedSuggestion(null);
      });

      it('should remember focused suggestion when mouse enters suggestion', function() {
        mouseOverFromInputToSuggestion(0);
        clickDown();
        expectFocusedSuggestion('Mordialloc');
        expectInputValue('Mordialloc');
      });
    });

    describe('Object suggestions', function() {
      beforeEach(function() {
        createAutosuggest(
          <Autosuggest suggestions={getSuburbObjects}
                       suggestionRenderer={renderSuburbObject}
                       suggestionValue={getSuburbObjectValue} />
        );
        setInputValue('m');
      });

      it('should set input field value when suggestion is clicked', function() {
        mouseDownSuggestion(0);
        expectInputValue('Mill Park VIC 3083');
      });
    });
  });

  describe('Accessibility attributes', function() {
    beforeEach(function() {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
    });

    describe('when Autosuggest is rendered', function() {
      it('input\'s role should be combobox', function() {
        expect(input.getAttribute('role')).toBe('combobox');
      });

      it('input\'s aria-autocomplete should be list', function() {
        expect(input.getAttribute('aria-autocomplete')).toBe('list');
      });

      it('input\'s aria-expanded should be false', function() {
        expect(input.getAttribute('aria-expanded')).toBe('false');
      });

      it('input\'s aria-activedescendant should not present', function() {
        expect(input.getAttribute('aria-activedescendant')).toBeNull();
      });
    });

    describe('when suggestions appear', function() {
      beforeEach(function() {
        setInputValue('m');
      });

      it('input\'s aria-expanded should be true', function() {
        expect(input.getAttribute('aria-expanded')).toBe('true');
      });

      it('input\'s aria-expanded should become false when input is cleared', function() {
        setInputValue('');
        expect(input.getAttribute('aria-expanded')).toBe('false');
      });

      it('input\'s aria-activedescendant should be the id of the focused suggestion when using keyboard', function() {
        clickDown();
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(input.getAttribute('aria-activedescendant')).toBe(React.findDOMNode(suggestions[0]).id);
      });

      it('input\'s aria-activedescendant should be the id of the focused suggestion when using mouse', function() {
        mouseOverFromInputToSuggestion(0);
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(input.getAttribute('aria-activedescendant')).toBe(React.findDOMNode(suggestions[0]).id);
      });

      it('suggestion\'s role should be option', function() {
        clickDown();
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(React.findDOMNode(suggestions[0]).getAttribute('role')).toBe('option');
      });

      it('input\'s aria-owns should be equal to suggestions list\'s id', function() {
        suggestionsList = TestUtils.findRenderedDOMComponentWithClass(autosuggest, 'react-autosuggest__suggestions');
        expect(input.getAttribute('aria-owns')).toBe(React.findDOMNode(suggestionsList).id);
      });

      it('suggestions list\'s role should be listbox', function() {
        suggestionsList = TestUtils.findRenderedDOMComponentWithClass(autosuggest, 'react-autosuggest__suggestions');
        expect(React.findDOMNode(suggestionsList).getAttribute('role')).toBe('listbox');
      });
    });
  });

  describe('Multiple sections', function() {
    beforeEach(function() {
      createAutosuggest(<Autosuggest suggestions={getMultipleSectionsSuburbs} />);
      setInputValue('m');
    });

    it('should render section names', function() {
      expectSections([null, 'Second section', 'Third section']);
    });
  });

  describe('Delayed requests', function() {
    it('should set suggestions', function() {
      function getDelayedSuburbStrings(input, callback) {
        switch (input) {
          case 'r':
            setTimeout(function() { callback(null, ['Raglan', 'Riachella', 'Richmond']); }, 20);
            break;
          case 'ri':
            setTimeout(function() { callback(null, ['Riachella', 'Richmond']); }, 50);
            break;
        }
      }
      createAutosuggest(<Autosuggest suggestions={getDelayedSuburbStrings} />);

      setInputValue('r');
      setInputValue('ri');
      jest.runAllTimers();

      expectSuggestions(['Riachella', 'Richmond']);
    });

    it('should ignore delayed suggestions', function() {
      function getDelayedSuburbStrings(input, callback) {
        switch (input) {
          case 'r':
            setTimeout(function() { callback(null, ['Raglan', 'Riachella', 'Richmond']); }, 50);
            break;
          case 'ri':
            setTimeout(function() { callback(null, ['Riachella', 'Richmond']); }, 20);
            break;
        }
      }
      createAutosuggest(<Autosuggest suggestions={getDelayedSuburbStrings} />);

      setInputValue('r');
      setInputValue('ri');
      jest.runAllTimers();

      expectSuggestions(['Riachella', 'Richmond']);
    });

    it('should not display delayed suggestions if input is empty', function() {
      function getDelayedSuburbStrings(input, callback) {
        setTimeout(function() { callback(null, ['Raglan', 'Riachella', 'Richmond']); }, 50);
      }
      createAutosuggest(<Autosuggest suggestions={getDelayedSuburbStrings} />);

      setInputValue('r');
      setInputValue('');
      jest.runAllTimers();

      expectSuggestions([]);
    });
  });

  describe('Misc', function() {
    beforeEach(function() {
      createAutosuggest(<Autosuggest suggestions={getSuburbStrings} />);
    });

    it('should reset sectionIterator when getting cached suggestions', function() {
      setInputValue('m');
      setInputValue('mz');
      setInputValue('m');
      clickDown();
      expectFocusedSuggestion('Mill Park');
    });
  });
});
