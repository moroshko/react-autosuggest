'use strict';

jest.dontMock('../Autosuggest.js');

var React = require('react/addons');
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

function setInputValue(value) {
  React.addons.TestUtils.Simulate.change(input, { target: { value: value } });
}

function clickSuggestion(suggestionIndex) {
  suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
  React.addons.TestUtils.Simulate.mouseDown(suggestions[suggestionIndex].getDOMNode());
}

function clickEscape() {
  React.addons.TestUtils.Simulate.keyDown(input, { keyCode: 27 });
}

function clickDown() {
  React.addons.TestUtils.Simulate.keyDown(input, { keyCode: 40 });
}

function clickUp() {
  React.addons.TestUtils.Simulate.keyDown(input, { keyCode: 38 });
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

describe('Autosuggest', function() {
  describe('Basics', function() {
    beforeEach(function() {
      autosuggest = TestUtils.renderIntoDocument(
        <Autosuggest initialValue="my value" suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
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

  describe('Interacting with suggestions', function() {
    beforeEach(function() {
      setInputValue('m');
    });

    it('should set input field value when suggestion is clicked', function() {
      clickSuggestion(1);
      expectInputValue('Mordialloc');
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

    it('should remove focus from suggestions when last suggestion is focused and Down is clicked ', function() {
      clickDown();
      clickDown();
      clickDown();
      // TODO
      //expectFocusedSuggestion(null);
      //expectInputValue('m');
    });
  });
});
