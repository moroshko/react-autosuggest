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

function getObjectSuggestions(input, callback) {
  callback(null, [
    {
      name: "sug1",
      data: 5
    },
    {
      name: "sug2",
      data: 4
    },
  ]);
}

function getMixedSuggestions(input, callback) {
  callback(null, ["sug1", 2, "sug3"]);
}

function renderLocation(suggestion, input) {
  return (
    <span><strong>{suggestion.slice(0, input.length)}</strong>{suggestion.slice(input.length)}</span>
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

function expectSections(expectedSections) {
  var sections = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestions-section');

  expect(sections.length).toBe(expectedSections.length);

  for (var i = 0; i < sections.length; i++) {
    var sectionName = TestUtils.scryRenderedDOMComponentsWithClass(sections[i], 'react-autosuggest__suggestions-section-name');

    if (expectedSections[i] === null) {
      expect(sectionName.length).toBe(0);
    } else {
      expect(sectionName.length).toBe(1);
      expect(sectionName[0].getDOMNode().textContent).toBe(expectedSections[i]);
    }
  }
}

function createAutosuggest(Autosuggest) {
  autosuggest = TestUtils.renderIntoDocument(Autosuggest);
}

describe('Autosuggest', function() {
  describe('Basics', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest inputAttributes={{ id: 'my-autosuggest',
                                        name: 'my-autosuggest-name',
                                        placeholder: 'Enter location...',
                                        className: 'my-sweet-autosuggest',
                                        value: 'my value' }}
                     suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
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

  describe('Suggestion renderer', function() {

    describe('when suggestionRenderer provided', function(){

      it('should use the specified suggestionRenderer function', function() {
        createAutosuggest(
          <Autosuggest inputAttributes={{ id: 'my-autosuggest', value: 'my value' }}
                       suggestions={getSuburbs}
                       suggestionRenderer={renderLocation} />
        );
        input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
        setInputValue('m');

        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(stripReactAttributes(suggestions[0].getDOMNode().innerHTML)).toBe('<span><strong>M</strong><span>ill Park</span></span>');
      });

      it('should pass regular objects to the suggestionRenderer function', function() {
        var renderer = jest.genMockFunction();
        createAutosuggest(
          <Autosuggest suggestions={getObjectSuggestions}
                       suggestionRenderer={renderer} />
        );
        input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
        setInputValue('m');

        expect(renderer.mock.calls.length).toEqual(2);
        expect(renderer.mock.calls[0][0]['name']).toEqual('sug1');
        expect(renderer.mock.calls[1][0]['name']).toEqual('sug2');
      });
    });

    describe('when suggestionRenderer not provided', function(){

      it('should render suggestion as is if it is not an object, i.e. string or number', function() {
        createAutosuggest(
          <Autosuggest suggestions={getMixedSuggestions} />
        );
        input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
        setInputValue('m');

        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(suggestions.length).toEqual(3);
        expect(suggestions[0].props.children).toEqual('sug1');
        expect(suggestions[1].props.children).toEqual(2);
        expect(suggestions[2].props.children).toEqual('sug3');
      });

      it('should render suggestion as object\'s displayKey when suggestion is object ', function() {
        createAutosuggest(
          <Autosuggest suggestions={getObjectSuggestions}
                       displayKey={'name'} />
        );
        input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
        setInputValue('m');

        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(suggestions.length).toEqual(2);
        expect(suggestions[0].props.children).toEqual('sug1');
        expect(suggestions[1].props.children).toEqual('sug2');
      });

      it('should throw error if suggestion is object and does not contain displayKey', function() {
        createAutosuggest(
          <Autosuggest suggestions={getObjectSuggestions} />
        );
        input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
        expect(setInputValue.bind(null, 'm')).toThrow('Invalid suggestion');
      });
    });
  });

  describe('Keyboard interactions', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest inputAttributes={{ id: 'my-autosuggest', value: 'my-value' }}
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
        <Autosuggest inputAttributes={{ id: 'my-autosuggest', value: 'my value' }}
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

    describe('when suggestion is object', function() {

      it('should set input field value when suggestion is clicked', function() {
        createAutosuggest(
          <Autosuggest inputAttributes={{ id: 'my-autosuggest', value: 'my value' }}
                       suggestions={getObjectSuggestions}
                       displayKey={'name'} />
        );
        input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
        setInputValue('m');
        mouseDownSuggestion(1);
        expectInputValue('sug2');
      });

      it('should throw error if suggestion object does not contain displayKey', function() {
        createAutosuggest(
          <Autosuggest inputAttributes={{ id: 'my-autosuggest', value: 'my value' }}
                       suggestions={getObjectSuggestions} />
        );
        input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
        expect(setInputValue.bind(null,'m')).toThrow('Invalid suggestion');
      });
    });

    beforeEach(function() {
      createAutosuggest(
        <Autosuggest inputAttributes={{ id: 'my-autosuggest', value: 'my value' }}
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

      it('input\'s aria-expanded should become false when input is cleared', function() {
        setInputValue('');
        expect(input.getAttribute('aria-expanded')).toBe('false');
      });

      it('input\'s aria-activedescendant should be the id of the focused suggestion when using keyboard', function() {
        clickDown();
        suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
        expect(input.getAttribute('aria-activedescendant')).toBe(suggestions[0].getDOMNode().id);
      });

      it('input\'s aria-activedescendant should be the id of the focused suggestion when using mouse', function() {
        mouseOverFromInputToSuggestion(0);
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

  describe('isMultipleSections', function(){

    it('returns true if suggestions are multiple section objects', function() {
      createAutosuggest(
        <Autosuggest suggestions={getMultipleSectionsSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
      setInputValue('m');
      expect(autosuggest.isMultipleSections(autosuggest.state.suggestions)).toBe(true);
    });

    it('returns false if suggestions are strings or numbers', function() {
      createAutosuggest(
        <Autosuggest suggestions={getMixedSuggestions} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
      setInputValue('m');
      expect(autosuggest.isMultipleSections(autosuggest.state.suggestions)).toBe(false);
    });

    it('returns false if suggestions are regular objects', function() {
      createAutosuggest(
        <Autosuggest suggestions={getObjectSuggestions}
                     displayKey={'name'} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
      setInputValue('m');
      expect(autosuggest.isMultipleSections(autosuggest.state.suggestions)).toBe(false);
    });
  });

  describe('Multiple sections', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest suggestions={getMultipleSectionsSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
      setInputValue('m');
    });

    it('should render section names', function() {
      expectSections([null, 'Second section', 'Third section']);
    });
  });

  describe('Misc', function() {
    beforeEach(function() {
      createAutosuggest(
        <Autosuggest suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input').getDOMNode();
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
