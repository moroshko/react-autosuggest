"use strict";

var _interopRequire = function (obj) { return obj && obj.__esModule ? obj["default"] : obj; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

var _createClass = (function () { function defineProperties(target, props) { for (var key in props) { var prop = props[key]; prop.configurable = true; if (prop.value) prop.writable = true; } Object.defineProperties(target, props); } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc && desc.writable) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var React = _interopRequire(require("react"));

var debounce = _interopRequire(require("debounce"));

var classnames = _interopRequire(require("classnames"));

var sectionIterator = _interopRequire(require("./sectionIterator"));

var Component = React.Component;
var PropTypes = React.PropTypes;
var findDOMNode = React.findDOMNode;

var lastSuggestionsInputValue = null,
    guid = 0;
var nop = function nop() {};

var Autosuggest = (function (_Component) {
  function Autosuggest(props) {
    _classCallCheck(this, Autosuggest);

    _get(Object.getPrototypeOf(Autosuggest.prototype), "constructor", this).call(this, props);

    guid += 1;
    this.id = guid;
    this.cache = {};
    this.state = {
      value: props.inputAttributes.value || "",
      suggestions: null,
      focusedSectionIndex: null, // Used when multiple sections are displayed
      focusedSuggestionIndex: null, // Index within a section
      valueBeforeUpDown: null // When user interacts using the Up and Down keys,
      // this field remembers input's value prior to
      // interaction in order to revert back if ESC hit.
      // See: http://www.w3.org/TR/wai-aria-practices/#autocomplete
    };
    this.suggestionsFn = debounce(this.props.suggestions, 100);
    this.onChange = props.inputEventAttributes.onChange || nop;
    this.onKeyDown = props.inputEventAttributes.onKeyDown || nop;
    this.onBlur = props.inputEventAttributes.onBlur || nop;
  }

  _inherits(Autosuggest, _Component);

  _createClass(Autosuggest, {
    resetSectionIterator: {
      value: function resetSectionIterator(suggestions) {
        if (this.isMultipleSections(suggestions)) {
          sectionIterator.setData(suggestions.map(function (suggestion) {
            return suggestion.suggestions.length;
          }));
        } else {
          sectionIterator.setData(suggestions === null ? [] : suggestions.length);
        }
      }
    },
    isMultipleSections: {
      value: function isMultipleSections(suggestions) {
        return suggestions !== null && suggestions.length > 0 && typeof suggestions[0].suggestions !== "undefined";
      }
    },
    setSuggestionsState: {
      value: function setSuggestionsState(suggestions) {
        this.resetSectionIterator(suggestions);
        this.setState({
          suggestions: suggestions,
          focusedSectionIndex: null,
          focusedSuggestionIndex: null,
          valueBeforeUpDown: null
        });
      }
    },
    suggestionsExist: {
      value: function suggestionsExist(suggestions) {
        if (this.isMultipleSections(suggestions)) {
          return suggestions.some(function (section) {
            return section.suggestions.length > 0;
          });
        }

        return suggestions !== null && suggestions.length > 0;
      }
    },
    showSuggestions: {
      value: function showSuggestions(input) {
        lastSuggestionsInputValue = input;

        if (input.length === 0) {
          this.setSuggestionsState(null);
        } else if (this.cache[input]) {
          this.setSuggestionsState(this.cache[input]);
        } else {
          this.suggestionsFn(input, (function (error, suggestions) {
            // If input value changed, suggestions are not relevant anymore.
            if (lastSuggestionsInputValue !== input) {
              return;
            }

            if (error) {
              throw error;
            } else {
              if (!this.suggestionsExist(suggestions)) {
                suggestions = null;
              }

              this.cache[input] = suggestions;
              this.setSuggestionsState(suggestions);
            }
          }).bind(this));
        }
      }
    },
    getSuggestionText: {
      value: function getSuggestionText(sectionIndex, suggestionIndex) {
        return findDOMNode(this.refs[this.getSuggestionKey(sectionIndex, suggestionIndex)]).textContent;
      }
    },
    focusOnSuggestion: {
      value: function focusOnSuggestion(suggestionPosition) {
        var _suggestionPosition = _slicedToArray(suggestionPosition, 2);

        var sectionIndex = _suggestionPosition[0];
        var suggestionIndex = _suggestionPosition[1];

        var newState = {
          focusedSectionIndex: sectionIndex,
          focusedSuggestionIndex: suggestionIndex,
          value: suggestionIndex === null ? this.state.valueBeforeUpDown : this.getSuggestionText(sectionIndex, suggestionIndex)
        };

        // When users starts to interact with up/down keys, remember input's value.
        if (this.state.valueBeforeUpDown === null) {
          newState.valueBeforeUpDown = this.state.value;
        }

        this.setState(newState);
        this.onChange(newState.value);
      }
    },
    onInputChange: {
      value: function onInputChange(event) {
        var newValue = event.target.value;

        this.setState({
          value: newValue,
          valueBeforeUpDown: null
        });

        this.onChange(newValue);

        this.showSuggestions(newValue);
      }
    },
    onInputKeyDown: {
      value: function onInputKeyDown(event) {
        var newState = undefined,
            newSectionIndex = undefined,
            newSuggestionIndex = undefined;

        switch (event.keyCode) {
          case 13:
            // enter
            this.setSuggestionsState(null);
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
            this.onChange(newState.value);
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
        this.onKeyDown();
      }
    },
    onInputBlur: {
      value: function onInputBlur() {
        this.setSuggestionsState(null);
        this.onBlur();
      }
    },
    onSuggestionMouseEnter: {
      value: function onSuggestionMouseEnter(sectionIndex, suggestionIndex) {
        this.setState({
          focusedSectionIndex: sectionIndex,
          focusedSuggestionIndex: suggestionIndex
        });
      }
    },
    onSuggestionMouseLeave: {
      value: function onSuggestionMouseLeave() {
        this.setState({
          focusedSectionIndex: null,
          focusedSuggestionIndex: null
        });
      }
    },
    onSuggestionMouseDown: {
      value: function onSuggestionMouseDown(sectionIndex, suggestionIndex) {
        var newValue = this.getSuggestionText(sectionIndex, suggestionIndex);
        this.setState({
          value: newValue,
          suggestions: null,
          focusedSectionIndex: null,
          focusedSuggestionIndex: null,
          valueBeforeUpDown: null
        }, function () {
          // This code executes after the component is re-rendered
          setTimeout((function () {
            findDOMNode(this.refs.input).focus();
          }).bind(this));
        });
        this.onChange(newValue);
      }
    },
    getSuggestionId: {
      value: function getSuggestionId(sectionIndex, suggestionIndex) {
        if (suggestionIndex === null) {
          return null;
        }

        return "react-autosuggest-" + this.id + "-suggestion-" + (sectionIndex === null ? "" : sectionIndex) + "-" + suggestionIndex;
      }
    },
    getSuggestionKey: {
      value: function getSuggestionKey(sectionIndex, suggestionIndex) {
        return "suggestion-" + (sectionIndex === null ? "" : sectionIndex) + "-" + suggestionIndex;
      }
    },
    renderSuggestionContent: {
      value: function renderSuggestionContent(suggestion) {
        if (this.props.suggestionRenderer) {
          return this.props.suggestionRenderer(suggestion, this.state.valueBeforeUpDown || this.state.value);
        }

        if (typeof suggestion === "object") {
          throw new Error("When <suggestion> is an object, you must implement the suggestionRenderer() function to specify how to render it.");
        } else {
          return suggestion.toString();
        }
      }
    },
    renderSuggestionsList: {
      value: function renderSuggestionsList(suggestions, sectionIndex) {
        return suggestions.map(function (suggestion, suggestionIndex) {
          var classes = classnames({
            "react-autosuggest__suggestion": true,
            "react-autosuggest__suggestion--focused": sectionIndex === this.state.focusedSectionIndex && suggestionIndex === this.state.focusedSuggestionIndex
          });
          var suggestionKey = this.getSuggestionKey(sectionIndex, suggestionIndex);

          return React.createElement(
            "div",
            { id: this.getSuggestionId(sectionIndex, suggestionIndex),
              className: classes,
              role: "option",
              key: suggestionKey,
              ref: suggestionKey,
              onMouseEnter: this.onSuggestionMouseEnter.bind(this, sectionIndex, suggestionIndex),
              onMouseLeave: this.onSuggestionMouseLeave.bind(this),
              onMouseDown: this.onSuggestionMouseDown.bind(this, sectionIndex, suggestionIndex) },
            this.renderSuggestionContent(suggestion)
          );
        }, this);
      }
    },
    renderSuggestions: {
      value: function renderSuggestions() {
        if (this.state.value === "" || this.state.suggestions === null) {
          return null;
        }

        var content = undefined;

        if (this.isMultipleSections(this.state.suggestions)) {
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
      }
    },
    render: {
      value: function render() {
        var ariaActivedescendant = this.getSuggestionId(this.state.focusedSectionIndex, this.state.focusedSuggestionIndex);
        var inputEventAttributes = this.props.inputEventAttributes;
        // The following event attributes have custom handling
        delete inputEventAttributes.onChange;
        delete inputEventAttributes.onKeyDown;
        delete inputEventAttributes.onBlur;

        return React.createElement(
          "div",
          { className: "react-autosuggest" },
          React.createElement("input", _extends({}, this.props.inputAttributes, inputEventAttributes, {
            type: "text",
            value: this.state.value,
            autoComplete: "off",
            role: "combobox",
            "aria-autocomplete": "list",
            "aria-owns": "react-autosuggest-" + this.id,
            "aria-expanded": this.state.suggestions !== null,
            "aria-activedescendant": ariaActivedescendant,
            ref: "input",
            onChange: this.onInputChange.bind(this),
            onKeyDown: this.onInputKeyDown.bind(this),
            onBlur: this.onInputBlur.bind(this) })),
          this.renderSuggestions()
        );
      }
    }
  });

  return Autosuggest;
})(Component);

Autosuggest.propTypes = {
  inputAttributes: PropTypes.objectOf(PropTypes.string), // Attributes to pass to the input field (e.g. { id: 'my-input', className: 'sweet autosuggest' })
  inputEventAttributes: PropTypes.objectOf(PropTypes.func), // Event attributes to pass to the input field (e.g. { onChange: onMyChange, onKeyUp: onMyKeyUp })
  suggestions: PropTypes.func.isRequired, // Function to get the suggestions
  suggestionRenderer: PropTypes.func // Function to render a single suggestion
};

Autosuggest.defaultProps = {
  inputAttributes: {},
  inputEventAttributes: {}
};

module.exports = Autosuggest;
