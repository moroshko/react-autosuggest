'use strict';

require('./Autosuggest.less');
require('./Examples.less');

var React = require('react');
var classnames = require('classnames');
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

var Examples = React.createClass({
  getInitialState: function() {
    this.examples = [
      'Basic example',
      'Multiple groups'
    ];

    return {
      activeExample: this.examples[0]
    };
  },
  componentDidMount: function() {
    React.findDOMNode(this.refs.location.refs.input).focus();
  },
  changeExample: function(example) {
    this.setState({
      activeExample: example
    });
  },
  render: function() {
    return (
      <div className="examples">
        <div className="examples-menu">
          {this.examples.map(function(example) {
            var classes = classnames({
              'examples-menu__item': true,
              'examples-menu__item--active': example === this.state.activeExample
            });

            return (
              <div className={classes} onClick={this.changeExample.bind(null, example)}>{example}</div>
            );
          }, this)}
        </div>
        <Autosuggest inputPlaceholder="Where do you live?"
                     ref="location"
                     suggestions={getLocations}
                     suggestionRenderer={renderLocation} />
      </div>
    );
  }
});

module.exports = Examples;
