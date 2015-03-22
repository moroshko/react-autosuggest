'use strict';

require('./Autosuggest.less');
require('./Examples.less');

var React = require('react');
var classnames = require('classnames');
var Autosuggest = require('../../src/Autosuggest');
var suburbs = require('json!./suburbs.json');

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function getLocations(input, callback) {
  var suburbMatchRegex = new RegExp('\\b' + input, 'i');

  setTimeout(function() {
    callback(null, suburbs.filter(function(suburb) {
      return suburb.search(suburbMatchRegex) !== -1;
    }).slice(0, 7));
  }, 300);
}

function getMultiSectionLocations(input, callback) {
  var firstSectionMatchRegex = new RegExp('^' + input, 'i');
  var secondSectionMatchRegex = new RegExp('^(?!' + input + ')\\w+ ' + input, 'i');
  var thirdSectionMatchRegex = new RegExp('^(?!' + input + ')\\w+ (?!' + input + ')\\w+ ' + input, 'i');

  var firstSectionSuburbs = suburbs.filter(function(suburb) {
    return suburb.search(firstSectionMatchRegex) !== -1;
  });

  var secondSectionSuburbs = suburbs.filter(function(suburb) {
    return suburb.search(secondSectionMatchRegex) !== -1;
  });

  var thirdSectionSuburbs = suburbs.filter(function(suburb) {
    return suburb.search(thirdSectionMatchRegex) !== -1;
  });

  var result = [];
  var firstSectionCount, secondSectionCount, thirdSectionCount;

  if (thirdSectionSuburbs.length > 0) {
    thirdSectionCount = randomInt(1, Math.min(3, thirdSectionSuburbs.length));

    result.unshift({
      sectionName: 'Third word match',
      suggestions: thirdSectionSuburbs.slice(0, thirdSectionCount)
    });
  }

  if (secondSectionSuburbs.length > 0) {
    secondSectionCount = randomInt(1, Math.min(3, secondSectionSuburbs.length));

    result.unshift({
      sectionName: 'Second word match',
      suggestions: secondSectionSuburbs.slice(0, secondSectionCount)
    });
  }

  if (firstSectionSuburbs.length > 0) {
    firstSectionCount = Math.min(8 - secondSectionCount - thirdSectionCount, firstSectionSuburbs.length);

    result.unshift({
      suggestions: firstSectionSuburbs.slice(0, firstSectionCount)
    });
  }

  setTimeout(function() {
    callback(null, result);
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
      'Multiple sections'
    ];

    return {
      activeExample: this.examples[0]
    };
  },
  changeExample: function(example) {
    this.setState({
      activeExample: example
    });
  },
  renderMenu: function() {
    return (
      <div className="examples-menu">
        {this.examples.map(function(example) {
          var classes = classnames({
            'examples-menu__item': true,
            'examples-menu__item--active': example === this.state.activeExample
          });

          return (
            <div className={classes}
                 key={example}
                 onClick={this.changeExample.bind(null, example)}>
              {example}
            </div>
          );
        }, this)}
      </div>
    );
  },
  renderExample: function() {
    switch (this.state.activeExample) {
      case 'Basic example':
        return (
          <Autosuggest inputId="basic-example"
                       inputPlaceholder="Where do you live?"
                       ref="basicExample"
                       key="basicExample"
                       suggestions={getLocations}
                       suggestionRenderer={renderLocation} />
        );
      case 'Multiple sections':
        return (
          <Autosuggest inputId="multiple-sections"
                       inputPlaceholder="Where are you based?"
                       ref="multipleSections"
                       key="multipleSections"
                       suggestions={getMultiSectionLocations}
                       suggestionRenderer={renderLocation} />
        );
    }
  },
  render: function() {
    return (
      <div className="examples">
        {this.renderMenu()}
        {this.renderExample()}
      </div>
    );
  }
});

module.exports = Examples;
