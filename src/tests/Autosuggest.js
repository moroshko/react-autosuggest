'use strict';

jest.dontMock('../Autosuggest.js');

var React = require('react/addons');
var Simulate = React.addons.TestUtils.Simulate;
var SimulateNative = React.addons.TestUtils.SimulateNative;
var Autosuggest = require('../Autosuggest.js');
var TestUtils = React.addons.TestUtils;
var suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];
var reactAttributesRegex = / data-react[-\w]+="[^"]+"/g;
var autosuggest, input, suggestions;

function getSuburbs(input, callback) {
  var regex = new RegExp('^' + input, 'i');

  callback(null, suburbs.filter(function(suburb) {
    return regex.test(suburb);
  }));
}

function renderLocation(suggestion, input) {
  return (
    <span>{suggestion.slice(0, input.length)}<strong>{suggestion.slice(input.length)}</strong></span>
  );
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
        <Autosuggest inputId="my-autosuggest"
                     inputPlaceholder="Enter location..."
                     initialValue="my value"
                     suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
    });

    it('should set input\'s id', function() {
      expect(input.id).toBe('my-autosuggest');
    });

    it('should set input\'s placeholder', function() {
      expect(input.getAttribute('placeholder')).toBe('Enter location...');
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

  describe('Suggestion renderer', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest inputId="my-autosuggest"
                     initialValue="my value"
                     suggestions={getSuburbs}
                     suggestionRenderer={renderLocation} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
      setInputValue('m');
    });

    it('should use the specified suggestionRenderer function', function() {
      suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
      expect(stripReactAttributes(suggestions[0].getDOMNode().innerHTML)).toBe('<span><span>M</span><strong>ill Park</strong></span>');
    });
  });

  describe('Keyboard interactions', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest inputId="my-autosuggest"
                     initialValue="my value"
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

  describe('Revealing the suggestions using keyboard', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest inputId="my-autosuggest"
                     initialValue="my value"
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
        <Autosuggest inputId="my-autosuggest"
                     initialValue="my value"
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

  describe('Accessibility attributes', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
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

      it('input\'s aria-activedescendant should be the id of the focused suggestion', function() {
        clickDown();
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(input.getAttribute('aria-activedescendant')).toBe(suggestions[0].getDOMNode().id);
      });

      it('suggestion\'s role should be option', function() {
        clickDown();
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(suggestions[0].getDOMNode().getAttribute('role')).toBe('option');
      });

      it('input\'s aria-owns should be equal to suggestions list\'s id', function() {
        suggestionsList = TestUtils.findRenderedDOMComponentWithClass(autosuggest, 'react-autosuggest__suggestions');
        expect(input.getAttribute('aria-owns')).toBe(suggestionsList.getDOMNode().id);
      });

      it('suggestions list\'s role should be listbox', function() {
        suggestionsList = TestUtils.findRenderedDOMComponentWithClass(autosuggest, 'react-autosuggest__suggestions');
        expect(suggestionsList.getDOMNode().getAttribute('role')).toBe('listbox');
      });
    });
  });
});
