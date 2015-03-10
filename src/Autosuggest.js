'use strict';

var React = require('react/addons');
var guid = 0;

var Autosuggest = React.createClass({
  propTypes: {
    initialValue: React.PropTypes.string, // Initial value
    suggestions: React.PropTypes.func     // Function to get the suggestions
  },
  getDefaultProps: function() {
    return {
      initialValue: ''
    };
  },
  getInitialState: function() {
    guid += 1;
    this.id = guid;
    this.cache = {};

    return {
      value: this.props.initialValue,
      suggestions: [],
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null // When user interacts using the Up and Down keys,
                              // this field remembers input's value prior to 
                              // interaction in order to revert back if ESC hit.
                              // See: http://www.w3.org/TR/wai-aria-practices/#autocomplete
    };
  },
  getSuggestions: function(input) {
    if (input.length === 0) {
      return;
    }

    if (this.cache[input]) {
      this.setState({
        suggestions: this.cache[input],
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      });
    } else {
      this.props.suggestions(input, function(error, suggestions) {
        if (error) {
          console.log('Error: ', error);
        } else {
          this.cache[input] = suggestions;

          this.setState({
            suggestions: suggestions,
            focusedSuggestionIndex: null,
            valueBeforeUpDown: null
          });
        }
      }.bind(this));
    }
  },
  focusOnSuggestion: function(suggestionIndex) {
    var newState = {
      focusedSuggestionIndex: suggestionIndex,
      value: this.state.suggestions[suggestionIndex]
    };

    if (this.state.valueBeforeUpDown === null) {
      newState.valueBeforeUpDown = this.state.value;
    }

    this.setState(newState);
  },
  onInputChange: function(event) {
    var newValue = event.target.value;

    this.setState({
      value: newValue,
      valueBeforeUpDown: null
    });

    this.getSuggestions(newValue);
  },
  onInputKeyDown: function(event) {
    var newState;

    switch (event.keyCode) {
      case 13: // enter
        this.setState({
          suggestions: [],
          focusedSuggestionIndex: null,
          valueBeforeUpDown: null
        });

        break;

      case 27: // escape
        newState = {
          suggestions: [],
          valueBeforeUpDown: null
        };

        if (this.state.valueBeforeUpDown !== null) {
          newState.value = this.state.valueBeforeUpDown;
        } else if (this.state.suggestions.length === 0) {
          newState.value = '';
        }

        this.setState(newState);

        break;

      case 38: // up
        if (this.state.suggestions.length === 0) {
          this.getSuggestions(this.state.value);
        } else {
          this.focusOnSuggestion(
            this.state.focusedSuggestionIndex === null || this.state.focusedSuggestionIndex === 0
              ? this.state.suggestions.length - 1
              : this.state.focusedSuggestionIndex - 1
          );
        }

        event.preventDefault(); // Prevent the cursor from jumping to input's start

        break;

      case 40: // down
        if (this.state.suggestions.length === 0) {
          this.getSuggestions(this.state.value);
        } else {
          this.focusOnSuggestion(
            this.state.focusedSuggestionIndex === null
              ? 0
              : (this.state.focusedSuggestionIndex + 1) % this.state.suggestions.length
          );
        }

        break;
    }
  },
  onInputBlur: function() {
    this.setState({
      suggestions: [],
      valueBeforeUpDown: null
    });
  },
  onSuggestionMouseEnter: function(suggestionIndex) {
    this.setState({
      focusedSuggestionIndex: suggestionIndex
    });
  },
  onSuggestionMouseLeave: function() {
    this.setState({
      focusedSuggestionIndex: null
    });
  },
  onSuggestionMouseDown: function(suggestion) {
    this.setState({
      value: suggestion,
      suggestions: [],
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    }, function() {
      // This code executes after the component is re-rendered
      this.refs.input.getDOMNode().focus();
    });
  },
  renderSuggestions: function() {
    if (this.state.value === '' || this.state.suggestions.length === 0) {
      return '';
    }

    var content = this.state.suggestions.map(function(suggestion, index) {
      var classes = React.addons.classSet({
        'react-autosuggest__suggestion': true,
        'react-autosuggest__suggestion--focused':
          index === this.state.focusedSuggestionIndex
      });

      return (
        <div id={'react-autosuggest-' + this.id + '-suggestion-' + index}
             className={classes}
             role="option"
             key={'suggestion' + index}
             onMouseEnter={this.onSuggestionMouseEnter.bind(this, index)}
             onMouseLeave={this.onSuggestionMouseLeave}
             onMouseDown={this.onSuggestionMouseDown.bind(this, suggestion)}>
          {suggestion}
        </div>
      );
    }, this);

    return (
      <div id={'react-autosuggest-' + this.id}
           className="react-autosuggest__suggestions"
           role="listbox">
        {content}
      </div>
    );
  },
  render: function() {
    var ariaActivedescendant =
      this.state.focusedSuggestionIndex === null
        ? null
        : 'react-autosuggest-' + this.id + '-suggestion-' + this.state.focusedSuggestionIndex;

    return (
      <div className="react-autosuggest">
        <input type="text"
               value={this.state.value}
               role="combobox"
               aria-autocomplete="list"
               aria-owns={'react-autosuggest-' + this.id}
               aria-expanded={this.state.suggestions.length > 0}
               aria-activedescendant={ariaActivedescendant}
               ref="input"
               onChange={this.onInputChange}
               onKeyDown={this.onInputKeyDown}
               onBlur={this.onInputBlur} />
        {this.renderSuggestions()}
      </div>
    );
  }
});

module.exports = Autosuggest;
