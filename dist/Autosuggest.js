"use strict";

var React = require("react");
var classnames = require("classnames");
var guid = 0;

var Autosuggest = React.createClass({
  displayName: "Autosuggest",

  propTypes: {
    initialValue: React.PropTypes.string, // Input's initial value
    inputId: React.PropTypes.string, // Input's id
    inputPlaceholder: React.PropTypes.string, // Input's placeholder
    suggestions: React.PropTypes.func.isRequired, // Function to get the suggestions
    suggestionRenderer: React.PropTypes.func // Function to render a single suggestion
  },
  getDefaultProps: function getDefaultProps() {
    return {
      initialValue: "",
      inputId: null,
      inputPlaceholder: null
    };
  },
  getInitialState: function getInitialState() {
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
  getSuggestions: function getSuggestions(input) {
    if (input.length === 0) {
      this.setState({
        suggestions: [],
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      });
    } else if (this.cache[input]) {
      this.setState({
        suggestions: this.cache[input],
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      });
    } else {
      this.props.suggestions(input, (function (error, suggestions) {
        if (error) {
          throw error;
        } else {
          this.cache[input] = suggestions;

          this.setState({
            suggestions: suggestions,
            focusedSuggestionIndex: null,
            valueBeforeUpDown: null
          });
        }
      }).bind(this));
    }
  },
  focusOnSuggestion: function focusOnSuggestion(suggestionIndex) {
    var newState = {
      focusedSuggestionIndex: suggestionIndex,
      value: suggestionIndex === null ? this.state.valueBeforeUpDown : this.state.suggestions[suggestionIndex]
    };

    if (this.state.valueBeforeUpDown === null) {
      newState.valueBeforeUpDown = this.state.value;
    }

    this.setState(newState);
  },
  onInputChange: function onInputChange(event) {
    var newValue = event.target.value;

    this.setState({
      value: newValue,
      valueBeforeUpDown: null
    });

    this.getSuggestions(newValue);
  },
  onInputKeyDown: function onInputKeyDown(event) {
    var newState, newSuggestionIndex;

    switch (event.keyCode) {
      case 13:
        // enter
        this.setState({
          suggestions: [],
          focusedSuggestionIndex: null,
          valueBeforeUpDown: null
        });

        break;

      case 27:
        // escape
        newState = {
          suggestions: [],
          valueBeforeUpDown: null
        };

        if (this.state.valueBeforeUpDown !== null) {
          newState.value = this.state.valueBeforeUpDown;
        } else if (this.state.suggestions.length === 0) {
          newState.value = "";
        }

        this.setState(newState);

        break;

      case 38:
        // up
        if (this.state.suggestions.length === 0) {
          this.getSuggestions(this.state.value);
        } else {
          if (this.state.focusedSuggestionIndex === 0) {
            newSuggestionIndex = null;
          } else if (this.state.focusedSuggestionIndex === null) {
            newSuggestionIndex = this.state.suggestions.length - 1;
          } else {
            newSuggestionIndex = this.state.focusedSuggestionIndex - 1;
          }

          this.focusOnSuggestion(newSuggestionIndex);
        }

        event.preventDefault(); // Prevent the cursor from jumping to input's start

        break;

      case 40:
        // down
        if (this.state.suggestions.length === 0) {
          this.getSuggestions(this.state.value);
        } else {
          if (this.state.focusedSuggestionIndex === null) {
            newSuggestionIndex = 0;
          } else if (this.state.focusedSuggestionIndex === this.state.suggestions.length - 1) {
            newSuggestionIndex = null;
          } else {
            newSuggestionIndex = this.state.focusedSuggestionIndex + 1;
          }

          this.focusOnSuggestion(newSuggestionIndex);
        }

        break;
    }
  },
  onInputBlur: function onInputBlur() {
    this.setState({
      suggestions: [],
      valueBeforeUpDown: null
    });
  },
  onSuggestionMouseEnter: function onSuggestionMouseEnter(suggestionIndex) {
    this.setState({
      focusedSuggestionIndex: suggestionIndex
    });
  },
  onSuggestionMouseLeave: function onSuggestionMouseLeave() {
    this.setState({
      focusedSuggestionIndex: null
    });
  },
  onSuggestionMouseDown: function onSuggestionMouseDown(suggestion) {
    this.setState({
      value: suggestion,
      suggestions: [],
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    }, function () {
      // This code executes after the component is re-rendered
      setTimeout((function () {
        React.findDOMNode(this.refs.input).focus();
      }).bind(this));
    });
  },
  renderSuggestions: function renderSuggestions() {
    if (this.state.value === "" || this.state.suggestions.length === 0) {
      return "";
    }

    var content = this.state.suggestions.map(function (suggestion, index) {
      var classes = classnames({
        "react-autosuggest__suggestion": true,
        "react-autosuggest__suggestion--focused": index === this.state.focusedSuggestionIndex
      });

      var suggestionContent = this.props.suggestionRenderer ? this.props.suggestionRenderer(suggestion, this.state.valueBeforeUpDown || this.state.value) : suggestion;

      return React.createElement(
        "div",
        { id: "react-autosuggest-" + this.id + "-suggestion-" + index,
          className: classes,
          role: "option",
          key: "suggestion" + index,
          onMouseEnter: this.onSuggestionMouseEnter.bind(this, index),
          onMouseLeave: this.onSuggestionMouseLeave,
          onMouseDown: this.onSuggestionMouseDown.bind(this, suggestion) },
        suggestionContent
      );
    }, this);

    return React.createElement(
      "div",
      { id: "react-autosuggest-" + this.id,
        className: "react-autosuggest__suggestions",
        role: "listbox" },
      content
    );
  },
  render: function render() {
    var ariaActivedescendant = this.state.focusedSuggestionIndex === null ? null : "react-autosuggest-" + this.id + "-suggestion-" + this.state.focusedSuggestionIndex;

    return React.createElement(
      "div",
      { className: "react-autosuggest" },
      React.createElement("input", { id: this.props.inputId,
        type: "text",
        value: this.state.value,
        placeholder: this.props.inputPlaceholder,
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-owns": "react-autosuggest-" + this.id,
        "aria-expanded": this.state.suggestions.length > 0,
        "aria-activedescendant": ariaActivedescendant,
        ref: "input",
        onChange: this.onInputChange,
        onKeyDown: this.onInputKeyDown,
        onBlur: this.onInputBlur }),
      this.renderSuggestions()
    );
  }
});

module.exports = Autosuggest;
