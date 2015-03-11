'use strict';

jest.dontMock('../Autosuggest.js');

var React = require('react/addons');
var Simulate = React.addons.TestUtils.Simulate;
var SimulateNative = React.addons.TestUtils.SimulateNative;
var Autosuggest = require('../Autosuggest.js');
var TestUtils = React.addons.TestUtils;
var suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];
var autosuggest, input, suggestions;

function getSuburbs(input, callback) {
  var regex = new RegExp('^' + input, 'i');

  callback(null, suburbs.filter(function(suburb) {
    return regex.test(suburb);
  }));
}

function renderLocation(suggestion, input) {
  return (
    <span><strong>{suggestion.slice(0, input.length)}</strong>{suggestion.slice(input.length)}</span>
  );
}

function setInputValue(value) {
  Simulate.change(input, { target: { value: value } });
}

function mouseDownSuggestion(suggestionIndex) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  Simulate.mouseDown(suggestions[suggestionIndex].getDOMNode());
}

// See: https://github.com/facebook/react/issues/1297
function mouseOver(from, to) {
  SimulateNative.mouseOut(from, { relatedTarget: to });
  SimulateNative.mouseOver(to, { relatedTarget: from });
}

function mouseOverFromInputToSuggestion(suggestionIndex) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  mouseOver(input, suggestions[suggestionIndex].getDOMNode());
}

function mouseOverFromSuggestionToInput(suggestionIndex) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  mouseOver(suggestions[suggestionIndex].getDOMNode(), input);
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

function expectInputValue(expectedValue) {
  expect(input.value).toBe(expectedValue);
}

function expectSuggestions(expectedSuggestions) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  expect(suggestions.length).toBe(expectedSuggestions.length);

  for (var i = 0; i < expectedSuggestions.length; i++) {
    expect(suggestions[i].getDOMNode().textContent === expectedSuggestions[i]);
  }
}

function expectFocusedSuggestion(suggestion) {
  var focusedSuggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion--focused');

  if (suggestion === null) {
    expect(focusedSuggestions.length).toBe(0);
  } else {
    expect(focusedSuggestions.length).toBe(1);
    expect(focusedSuggestions[0].getDOMNode().textContent).toBe(suggestion);
  }
}

function createAutosuggest(Autosuggest) {
  autosuggest = TestUtils.renderIntoDocument(Autosuggest);
}

describe('Autosuggest', function() {
  describe('Basics', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest initialValue="my value"
                     inputId="my-autosuggest"
                     suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
    });

    it('should set initial value', function() {
      expectInputValue('my value');
    });

    it('should set input\'s id', function() {
      expect(input.id).toBe('my-autosuggest');
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

  describe('Suggestion renderer', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest initialValue="my value"
                     inputId="my-autosuggest"
                     suggestions={getSuburbs}
                     suggestionRenderer={renderLocation} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
      setInputValue('m');
    });

    it('should use the specified suggestionRenderer function', function() {
      suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
      // TODO
      //console.log(suggestions[0].getDOMNode().innerHTML);
    });
  });

  describe('Keyboard interactions', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest initialValue="my value"
                     inputId="my-autosuggest"
                     suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
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
      // TODO
      //expectFocusedSuggestion(null);
      //expectInputValue('m');
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
      // TODO
      //expectFocusedSuggestion(null);
      //expectInputValue('m');
    });
  });

  describe('Revealing the suggestions using keyboard', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest initialValue="my value"
                     inputId="my-autosuggest"
                     suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
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
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest initialValue="my value"
                     inputId="my-autosuggest"
                     suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
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
});
