'use strict';

require('./Autosuggest.less');
require('./app.less');

var React = require('react');
var Autosuggest = require('../../src/Autosuggest');
var suburbs = require('json!./suburbs.json');

function getLocations(input, callback) {
  var suburbMatchRegex = new RegExp('\\b' + input, 'i');

  setTimeout(function() {
    callback(null, suburbs.filter(function(suburb) {
      return suburb.search(suburbMatchRegex) !== -1;
    }).slice(0, 7));
  }, 300);
}

function renderLocation(suggestion, input) {
  var suburbMatchRegex = new RegExp('\\b' + input, 'i');
  var firstMatchIndex = suggestion.search(suburbMatchRegex);

  if (firstMatchIndex === -1) {
    return suggestion;
  }

  var beforeMatch = suggestion.slice(0, firstMatchIndex);
  var match = suggestion.slice(firstMatchIndex, firstMatchIndex + input.length);
  var afterMatch = suggestion.slice(firstMatchIndex + input.length);

  return (
    <span>{beforeMatch}<strong>{match}</strong>{afterMatch}</span>
  );
}

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>react-autosuggest</h1>
        <Autosuggest inputPlaceholder="Where do you live?"
                     suggestions={getLocations}
                     suggestionRenderer={renderLocation} />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
