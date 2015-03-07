'use strict';

jest.dontMock('../Autosuggest.js');

var React = require('react/addons');
var Autosuggest = require('../Autosuggest.js');
var TestUtils = React.addons.TestUtils;

describe('Autosuggest', function() {
  it('should render content', function() {
    var autosuggest = TestUtils.renderIntoDocument(<Autosuggest />);
    var autosuggestWrapper =
      TestUtils.findRenderedDOMComponentWithClass(autosuggest, 'react-autosuggest');

    expect(autosuggestWrapper.getDOMNode().textContent).toEqual('Hello World');
  });
});
