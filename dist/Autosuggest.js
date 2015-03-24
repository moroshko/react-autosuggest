"use strict";

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var React = require("react");
var classnames = require("classnames");
var sectionIterator = require("./sectionIterator");
var guid = 0;

var Autosuggest = React.createClass({
  displayName: "Autosuggest",

  propTypes: {
    initialValue: React.PropTypes.string, // Input's initial value
    inputId: React.PropTypes.string, // Input's id
    inputName: React.PropTypes.string, // Input's name
    inputPlaceholder: React.PropTypes.string, // Input's placeholder
    suggestions: React.PropTypes.func.isRequired, // Function to get the suggestions
    suggestionRenderer: React.PropTypes.func // Function to render a single suggestion
  },
  getDefaultProps: function getDefaultProps() {
    return {
      initialValue: "",
      inputId: null,
      inputName: null,
      inputPlaceholder: null
    };
  },
  getInitialState: function getInitialState() {
    guid += 1;
    this.id = guid;
    this.cache = {};

    return {
      value: this.props.initialValue,
      suggestions: null,
      focusedSectionIndex: null, // Used when multiple sections are displayed
      focusedSuggestionIndex: null, // Index within a section
      valueBeforeUpDown: null // When user interacts using the Up and Down keys,
      // this field remembers input's value prior to
      // interaction in order to revert back if ESC hit.
      // See: http://www.w3.org/TR/wai-aria-practices/#autocomplete
    };
  },
  showSuggestions: function showSuggestions(input) {
    if (input.length === 0) {
      this.setState({
        suggestions: null,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      });
    } else if (this.cache[input]) {
      this.setState({
        suggestions: this.cache[input],
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      });
    } else {
      this.props.suggestions(input, (function (error, suggestions) {
        if (error) {
          throw error;
        } else {
          this.cache[input] = suggestions;
          this.multipleSections = suggestions.length > 0 && typeof suggestions[0] === "object";

          if (this.multipleSections) {
            sectionIterator.setData(suggestions.map(function (suggestion) {
              return suggestion.suggestions.length;
            }));
          } else {
            sectionIterator.setData(suggestions.length);
          }

          this.setState({
            suggestions: suggestions,
            focusedSectionIndex: null,
            focusedSuggestionIndex: null,
            valueBeforeUpDown: null
          });
        }
      }).bind(this));
    }
  },
  getSuggestion: function getSuggestion(sectionIndex, suggestionIndex) {
    return this.multipleSections ? this.state.suggestions[sectionIndex].suggestions[suggestionIndex] : this.state.suggestions[suggestionIndex];
  },
  focusOnSuggestion: function focusOnSuggestion(suggestionPosition) {
    var _suggestionPosition = _slicedToArray(suggestionPosition, 2);

    var sectionIndex = _suggestionPosition[0];
    var suggestionIndex = _suggestionPosition[1];

    var newState = {
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex,
      value: suggestionIndex === null ? this.state.valueBeforeUpDown : this.getSuggestion(sectionIndex, suggestionIndex)
    };

    // When users starts to interact with up/down keys, remember input's value.
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

    this.showSuggestions(newValue);
  },
  onInputKeyDown: function onInputKeyDown(event) {
    var newState, newSectionIndex, newSuggestionIndex;

    switch (event.keyCode) {
      case 13:
        // enter
        this.setState({
          suggestions: null,
          focusedSectionIndex: null,
          focusedSuggestionIndex: null,
          valueBeforeUpDown: null
        });

        break;

      case 27:
        // escape
        newState = {
          suggestions: null,
          focusedSectionIndex: null,
          focusedSuggestionIndex: null,
          valueBeforeUpDown: null
        };

        if (this.state.valueBeforeUpDown !== null) {
          newState.value = this.state.valueBeforeUpDown;
        } else if (this.state.suggestions === null) {
          newState.value = "";
        }

        this.setState(newState);

        break;

      case 38:
        // up
        if (this.state.suggestions === null) {
          this.showSuggestions(this.state.value);
        } else {
          this.focusOnSuggestion(sectionIterator.prev([this.state.focusedSectionIndex, this.state.focusedSuggestionIndex]));
        }

        event.preventDefault(); // Prevent the cursor from jumping to input's start

        break;

      case 40:
        // down
        if (this.state.suggestions === null) {
          this.showSuggestions(this.state.value);
        } else {
          this.focusOnSuggestion(sectionIterator.next([this.state.focusedSectionIndex, this.state.focusedSuggestionIndex]));
        }

        break;
    }
  },
  onInputBlur: function onInputBlur() {
    this.setState({
      suggestions: null,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    });
  },
  onSuggestionMouseEnter: function onSuggestionMouseEnter(sectionIndex, suggestionIndex) {
    this.setState({
      focusedSectionIndex: sectionIndex,
      focusedSuggestionIndex: suggestionIndex
    });
  },
  onSuggestionMouseLeave: function onSuggestionMouseLeave() {
    this.setState({
      focusedSectionIndex: null,
      focusedSuggestionIndex: null
    });
  },
  onSuggestionMouseDown: function onSuggestionMouseDown(suggestion) {
    this.setState({
      value: suggestion,
      suggestions: null,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    }, function () {
      // This code executes after the component is re-rendered
      setTimeout((function () {
        React.findDOMNode(this.refs.input).focus();
      }).bind(this));
    });
  },
  getSuggestionId: function getSuggestionId(sectionIndex, suggestionIndex) {
    if (suggestionIndex === null) {
      return null;
    }

    return "react-autosuggest-" + this.id + "-suggestion-" + (sectionIndex === null ? "" : sectionIndex) + "-" + suggestionIndex;
  },
  renderSuggestionsList: function renderSuggestionsList(suggestions, sectionIndex) {
    return suggestions.map(function (suggestion, suggestionIndex) {
      var classes = classnames({
        "react-autosuggest__suggestion": true,
        "react-autosuggest__suggestion--focused": sectionIndex === this.state.focusedSectionIndex && suggestionIndex === this.state.focusedSuggestionIndex
      });

      var suggestionContent = this.props.suggestionRenderer ? this.props.suggestionRenderer(suggestion, this.state.valueBeforeUpDown || this.state.value) : suggestion;

      return React.createElement(
        "div",
        { id: this.getSuggestionId(sectionIndex, suggestionIndex),
          className: classes,
          role: "option",
          key: "suggestion-" + (suggestionIndex === null ? "" : suggestionIndex) + "-" + suggestionIndex,
          onMouseEnter: this.onSuggestionMouseEnter.bind(this, sectionIndex, suggestionIndex),
          onMouseLeave: this.onSuggestionMouseLeave,
          onMouseDown: this.onSuggestionMouseDown.bind(this, suggestion) },
        suggestionContent
      );
    }, this);
  },
  renderSuggestions: function renderSuggestions() {
    if (this.state.value === "" || this.state.suggestions === null) {
      return null;
    }

    var content;

    if (this.multipleSections) {
      content = this.state.suggestions.map(function (section, sectionIndex) {
        var sectionName = section.sectionName ? React.createElement(
          "div",
          { className: "react-autosuggest__suggestions-section-name" },
          section.sectionName
        ) : null;

        return section.suggestions.length === 0 ? null : React.createElement(
          "div",
          { className: "react-autosuggest__suggestions-section",
            key: "section-" + sectionIndex },
          sectionName,
          this.renderSuggestionsList(section.suggestions, sectionIndex)
        );
      }, this);
    } else {
      content = this.renderSuggestionsList(this.state.suggestions, null);
    }

    return React.createElement(
      "div",
      { id: "react-autosuggest-" + this.id,
        className: "react-autosuggest__suggestions",
        role: "listbox" },
      content
    );
  },
  render: function render() {
    var ariaActivedescendant = this.getSuggestionId(this.state.focusedSectionIndex, this.state.focusedSuggestionIndex);

    return React.createElement(
      "div",
      { className: "react-autosuggest" },
      React.createElement("input", { id: this.props.inputId,
        name: this.props.inputName,
        type: "text",
        value: this.state.value,
        placeholder: this.props.inputPlaceholder,
        autoComplete: "off",
        role: "combobox",
        "aria-autocomplete": "list",
        "aria-owns": "react-autosuggest-" + this.id,
        "aria-expanded": this.state.suggestions !== null,
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
