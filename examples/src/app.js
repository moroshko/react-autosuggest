'use strict';

require('./Autosuggest.less');

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

var App = React.createClass({
  render: function() {
    return (
      <div>
        <strong>Where</strong>
        <Autosuggest suggestions={getLocations} />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
