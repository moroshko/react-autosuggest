'use strict';

require('./Autosuggest.less');
require('./app.less');

var React = require('react');
var Autosuggest = require('../../src/Autosuggest');
var suburbs = require('json!./suburbs.json');

function getLocations(input, callback) {
  var regex = new RegExp('^' + input, 'i');

  setTimeout(function() {
    callback(null, suburbs.filter(function(suburb) {
      return regex.test(suburb);
    }));
  }, 300);
}

function getLocationsWithLimit(input, callback) {
  var regex = new RegExp('^' + input, 'i');

  setTimeout(function() {
    callback(null, suburbs.filter(function(suburb) {
      return regex.test(suburb);
    }).slice(0, 7));
  }, 300);
}

function renderLocation(suggestion, input) {
  return (
    <span><strong>{suggestion.slice(0, input.length)}</strong>{suggestion.slice(input.length)}</span>
  );
}

var App = React.createClass({
  render: function() {
    return (
      <div className="examples">
        <div className="example">
          <h2>Basic Example</h2>
          <label htmlFor="basic-example">Where</label>
          <Autosuggest inputId="basic-example" suggestions={getLocations} />
        </div>
        <div className="example">
          <h2>Custom suggestion renderer</h2>
          <label htmlFor="custom-renderer-example">Where</label>
          <Autosuggest inputId="custom-renderer-example" suggestions={getLocations} suggestionRenderer={renderLocation} />
        </div>
        <div className="example">
          <h2>Limiting the amount of suggestions displayed</h2>
          <label htmlFor="limit-example">Where</label>
          <Autosuggest inputId="limit-example" suggestions={getLocationsWithLimit} suggestionRenderer={renderLocation} />
        </div>
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
