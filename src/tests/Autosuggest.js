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

describe('Autosuggest', function() {
  describe('Basics', function() {
    beforeEach(function() {
      autosuggest = TestUtils.renderIntoDocument(
        <Autosuggest initialValue="my value" suggestions={getSuburbs} />
      );
      input = TestUtils.findRenderedDOMComponentWithTag(autosuggest, 'input');
    });

    it('should set initial value', function() {
      expect(input.getDOMNode().value).toBe('my value');
    });

    it('should not show suggestions by default', function() {
      suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
      expect(suggestions.length).toBe(0);
    });

    it('should show suggestions when matches exist', function() {
      React.addons.TestUtils.Simulate.change(input, { target: { value: 'm' } });
      suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
      expect(suggestions.length).toBe(2);
    });

    it('should show suggestions when case insensitive matches exist', function() {
      React.addons.TestUtils.Simulate.change(input, { target: { value: 'NUNA' } });
      suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
      expect(suggestions.length).toBe(1);
    });

    it('should show not suggestions when no matches exist', function() {
      React.addons.TestUtils.Simulate.change(input, { target: { value: 'a' } });
      suggestions = TestUtils.scryRenderedDOMComponentsWithClass(autosuggest, 'react-autosuggest__suggestion');
      expect(suggestions.length).toBe(0);
    });
  });
});
