module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

	var React = __webpack_require__(1);
	var classnames = __webpack_require__(3);
	var sectionIterator = __webpack_require__(2);
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

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = require("react");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";

	var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; for (var _iterator = arr[Symbol.iterator](), _step; !(_step = _iterator.next()).done;) { _arr.push(_step.value); if (i && _arr.length === i) break; } return _arr; } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } };

	var data, multipleSections;

	function setData(newData) {
	  data = newData;
	  multipleSections = typeof data === "object";
	}

	function nextNonEmptySectionIndex(sectionIndex) {
	  if (sectionIndex === null) {
	    sectionIndex = 0;
	  } else {
	    sectionIndex++;
	  }

	  while (sectionIndex < data.length && data[sectionIndex] === 0) {
	    sectionIndex++;
	  }

	  return sectionIndex === data.length ? null : sectionIndex;
	}

	function prevNonEmptySectionIndex(sectionIndex) {
	  if (sectionIndex === null) {
	    sectionIndex = data.length - 1;
	  } else {
	    sectionIndex--;
	  }

	  while (sectionIndex >= 0 && data[sectionIndex] === 0) {
	    sectionIndex--;
	  }

	  return sectionIndex === -1 ? null : sectionIndex;
	}

	function next(position) {
	  var _position = _slicedToArray(position, 2);

	  var sectionIndex = _position[0];
	  var itemIndex = _position[1];

	  if (multipleSections) {
	    if (itemIndex === null || itemIndex === data[sectionIndex] - 1) {
	      sectionIndex = nextNonEmptySectionIndex(sectionIndex);

	      if (sectionIndex === null) {
	        return [null, null];
	      }

	      return [sectionIndex, 0];
	    }

	    return [sectionIndex, itemIndex + 1];
	  }

	  if (data === 0 || itemIndex === data - 1) {
	    return [null, null];
	  }

	  if (itemIndex === null) {
	    return [null, 0];
	  }

	  return [null, itemIndex + 1];
	}

	function prev(position) {
	  var _position = _slicedToArray(position, 2);

	  var sectionIndex = _position[0];
	  var itemIndex = _position[1];

	  if (multipleSections) {
	    if (itemIndex === null || itemIndex === 0) {
	      sectionIndex = prevNonEmptySectionIndex(sectionIndex);

	      if (sectionIndex === null) {
	        return [null, null];
	      }

	      return [sectionIndex, data[sectionIndex] - 1];
	    }

	    return [sectionIndex, itemIndex - 1];
	  }

	  if (data === 0 || itemIndex === 0) {
	    return [null, null];
	  }

	  if (itemIndex === null) {
	    return [null, data - 1];
	  }

	  return [null, itemIndex - 1];
	}

	module.exports = {
	  setData: setData,
	  next: next,
	  prev: prev
	};

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	function classNames() {
		var classes = '';
		var arg;

		for (var i = 0; i < arguments.length; i++) {
			arg = arguments[i];
			if (!arg) {
				continue;
			}

			if ('string' === typeof arg || 'number' === typeof arg) {
				classes += ' ' + arg;
			} else if (Object.prototype.toString.call(arg) === '[object Array]') {
				classes += ' ' + classNames.apply(null, arg);
			} else if ('object' === typeof arg) {
				for (var key in arg) {
					if (!arg.hasOwnProperty(key) || !arg[key]) {
						continue;
					}
					classes += ' ' + key;
				}
			}
		}
		return classes.substr(1);
	}

	// safely export classNames in case the script is included directly on a page
	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	}


/***/ }
/******/ ]);