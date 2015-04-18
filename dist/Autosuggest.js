'use strict';

var _interopRequireWildcard = function (obj) { return obj && obj.__esModule ? obj : { 'default': obj }; };

var _slicedToArray = function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } };

var _classCallCheck = function (instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(object, property, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _inherits = function (subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) subClass.__proto__ = superClass; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _React$Component$PropTypes$findDOMNode = require('react');

var _React$Component$PropTypes$findDOMNode2 = _interopRequireWildcard(_React$Component$PropTypes$findDOMNode);

var _debounce = require('debounce');

var _debounce2 = _interopRequireWildcard(_debounce);

var _classnames = require('classnames');

var _classnames2 = _interopRequireWildcard(_classnames);

var _sectionIterator = require('./sectionIterator');

var _sectionIterator2 = _interopRequireWildcard(_sectionIterator);

'use strict';

var lastSuggestionsInputValue = null,
    guid = 0;

var Autosuggest = (function (_Component) {
  function Autosuggest(props) {
    _classCallCheck(this, Autosuggest);

    _get(Object.getPrototypeOf(Autosuggest.prototype), 'constructor', this).call(this);

    guid += 1;
    this.id = guid;
    this.cache = {};
    this.state = {
      value: props.inputAttributes.value || '',
      suggestions: null,
      focusedSectionIndex: null, // Used when multiple sections are displayed
      focusedSuggestionIndex: null, // Index within a section
      valueBeforeUpDown: null // When user interacts using the Up and Down keys,
      // this field remembers input's value prior to
      // interaction in order to revert back if ESC hit.
      // See: http://www.w3.org/TR/wai-aria-practices/#autocomplete
    };
    this.suggestionsFn = _debounce2['default'](props.suggestions, 100);
  }

  _inherits(Autosuggest, _Component);

  _createClass(Autosuggest, [{
    key: 'resetSectionIterator',
    value: function resetSectionIterator(suggestions) {
      if (this.isMultipleSections(suggestions)) {
        _sectionIterator2['default'].setData(suggestions.map(function (suggestion) {
          return suggestion.suggestions.length;
        }));
      } else {
        _sectionIterator2['default'].setData(suggestions === null ? [] : suggestions.length);
      }
    }
  }, {
    key: 'isMultipleSections',
    value: function isMultipleSections(suggestions) {
      return suggestions !== null && suggestions.length > 0 && typeof suggestions[0].suggestions !== 'undefined';
    }
  }, {
    key: 'setSuggestionsState',
    value: function setSuggestionsState(suggestions) {
      this.resetSectionIterator(suggestions);
      this.setState({
        suggestions: suggestions,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      });
    }
  }, {
    key: 'suggestionsExist',
    value: function suggestionsExist(suggestions) {
      if (this.isMultipleSections(suggestions)) {
        return suggestions.some(function (section) {
          return section.suggestions.length > 0;
        });
      }

      return suggestions !== null && suggestions.length > 0;
    }
  }, {
    key: 'showSuggestions',
    value: function showSuggestions(input) {
      var _this = this;

      lastSuggestionsInputValue = input;

      if (!this.props.showWhen(input)) {
        this.setSuggestionsState(null);
      } else if (this.cache[input]) {
        this.setSuggestionsState(this.cache[input]);
      } else {
        this.suggestionsFn(input, function (error, suggestions) {
          // If input value changed, suggestions are not relevant anymore.
          if (lastSuggestionsInputValue !== input) {
            return;
          }

          if (error) {
            throw error;
          } else {
            if (!_this.suggestionsExist(suggestions)) {
              suggestions = null;
            }

            _this.cache[input] = suggestions;
            _this.setSuggestionsState(suggestions);
          }
        });
      }
    }
  }, {
    key: 'getSuggestion',
    value: function getSuggestion(sectionIndex, suggestionIndex) {
      if (this.isMultipleSections(this.state.suggestions)) {
        return this.state.suggestions[sectionIndex].suggestions[suggestionIndex];
      }

      return this.state.suggestions[suggestionIndex];
    }
  }, {
    key: 'getSuggestionValue',
    value: function getSuggestionValue(sectionIndex, suggestionIndex) {
      var suggestion = this.getSuggestion(sectionIndex, suggestionIndex);

      if (typeof suggestion === 'object') {
        if (this.props.suggestionValue) {
          return this.props.suggestionValue(suggestion);
        }

        throw new Error('When <suggestion> is an object, you must implement the suggestionValue() function to specify how to set input\'s value when suggestion selected.');
      } else {
        return suggestion.toString();
      }
    }
  }, {
    key: 'focusOnSuggestion',
    value: function focusOnSuggestion(suggestionPosition) {
      var _suggestionPosition = _slicedToArray(suggestionPosition, 2);

      var sectionIndex = _suggestionPosition[0];
      var suggestionIndex = _suggestionPosition[1];

      var newState = {
        focusedSectionIndex: sectionIndex,
        focusedSuggestionIndex: suggestionIndex,
        value: suggestionIndex === null ? this.state.valueBeforeUpDown : this.getSuggestionValue(sectionIndex, suggestionIndex)
      };

      // When users starts to interact with up/down keys, remember input's value.
      if (this.state.valueBeforeUpDown === null) {
        newState.valueBeforeUpDown = this.state.value;
      }

      this.setState(newState);
    }
  }, {
    key: 'onInputChange',
    value: function onInputChange(event) {
      var newValue = event.target.value;

      this.setState({
        value: newValue,
        valueBeforeUpDown: null
      });

      this.showSuggestions(newValue);
    }
  }, {
    key: 'onInputKeyDown',
    value: function onInputKeyDown(event) {
      var newState = undefined,
          newSectionIndex = undefined,
          newSuggestionIndex = undefined;

      switch (event.keyCode) {
        case 13:
          // enter
          if (this.state.valueBeforeUpDown !== null && this.state.focusedSuggestionIndex !== null) {
            this.props.onSuggestionSelected(this.getSuggestion(this.state.focusedSectionIndex, this.state.focusedSuggestionIndex), event);
          }

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
            newState.value = '';
          }

          this.setState(newState);
          break;

        case 38:
          // up
          if (this.state.suggestions === null) {
            this.showSuggestions(this.state.value);
          } else {
            this.focusOnSuggestion(_sectionIterator2['default'].prev([this.state.focusedSectionIndex, this.state.focusedSuggestionIndex]));
          }

          event.preventDefault(); // Prevent the cursor from jumping to input's start
          break;

        case 40:
          // down
          if (this.state.suggestions === null) {
            this.showSuggestions(this.state.value);
          } else {
            this.focusOnSuggestion(_sectionIterator2['default'].next([this.state.focusedSectionIndex, this.state.focusedSuggestionIndex]));
          }

          break;
      }
    }
  }, {
    key: 'onInputBlur',
    value: function onInputBlur() {
      this.setSuggestionsState(null);
    }
  }, {
    key: 'onSuggestionMouseEnter',
    value: function onSuggestionMouseEnter(sectionIndex, suggestionIndex) {
      this.setState({
        focusedSectionIndex: sectionIndex,
        focusedSuggestionIndex: suggestionIndex
      });
    }
  }, {
    key: 'onSuggestionMouseLeave',
    value: function onSuggestionMouseLeave() {
      this.setState({
        focusedSectionIndex: null,
        focusedSuggestionIndex: null
      });
    }
  }, {
    key: 'onSuggestionMouseDown',
    value: function onSuggestionMouseDown(sectionIndex, suggestionIndex, event) {
      this.setState({
        value: this.getSuggestionValue(sectionIndex, suggestionIndex),
        suggestions: null,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null
      }, function () {
        var _this2 = this;

        // This code executes after the component is re-rendered
        setTimeout(function () {
          return _React$Component$PropTypes$findDOMNode.findDOMNode(_this2.refs.input).focus();
        });
      });

      this.props.onSuggestionSelected(this.getSuggestion(sectionIndex, suggestionIndex), event);
    }
  }, {
    key: 'getSuggestionId',
    value: function getSuggestionId(sectionIndex, suggestionIndex) {
      if (suggestionIndex === null) {
        return null;
      }

      return 'react-autosuggest-' + this.id + '-suggestion-' + (sectionIndex === null ? '' : sectionIndex) + '-' + suggestionIndex;
    }
  }, {
    key: 'renderSuggestionContent',
    value: function renderSuggestionContent(suggestion) {
      if (this.props.suggestionRenderer) {
        return this.props.suggestionRenderer(suggestion, this.state.valueBeforeUpDown || this.state.value);
      }

      if (typeof suggestion === 'object') {
        throw new Error('When <suggestion> is an object, you must implement the suggestionRenderer() function to specify how to render it.');
      } else {
        return suggestion.toString();
      }
    }
  }, {
    key: 'renderSuggestionsList',
    value: function renderSuggestionsList(suggestions, sectionIndex) {
      var _this3 = this;

      return suggestions.map(function (suggestion, suggestionIndex) {
        var classes = _classnames2['default']({
          'react-autosuggest__suggestion': true,
          'react-autosuggest__suggestion--focused': sectionIndex === _this3.state.focusedSectionIndex && suggestionIndex === _this3.state.focusedSuggestionIndex
        });
        var suggestionKey = 'suggestion-' + (sectionIndex === null ? '' : sectionIndex) + '-' + suggestionIndex;

        return _React$Component$PropTypes$findDOMNode2['default'].createElement(
          'li',
          { id: _this3.getSuggestionId(sectionIndex, suggestionIndex),
            className: classes,
            role: 'option',
            key: suggestionKey,
            onMouseEnter: function () {
              return _this3.onSuggestionMouseEnter(sectionIndex, suggestionIndex);
            },
            onMouseLeave: function () {
              return _this3.onSuggestionMouseLeave();
            },
            onMouseDown: function (event) {
              return _this3.onSuggestionMouseDown(sectionIndex, suggestionIndex, event);
            } },
          _this3.renderSuggestionContent(suggestion)
        );
      });
    }
  }, {
    key: 'renderSuggestions',
    value: function renderSuggestions() {
      var _this4 = this;

      if (this.state.value === '' || this.state.suggestions === null) {
        return null;
      }

      if (this.isMultipleSections(this.state.suggestions)) {
        return _React$Component$PropTypes$findDOMNode2['default'].createElement(
          'div',
          { id: 'react-autosuggest-' + this.id,
            className: 'react-autosuggest__suggestions',
            role: 'listbox' },
          this.state.suggestions.map(function (section, sectionIndex) {
            var sectionName = section.sectionName ? _React$Component$PropTypes$findDOMNode2['default'].createElement(
              'div',
              { className: 'react-autosuggest__suggestions-section-name' },
              section.sectionName
            ) : null;

            return section.suggestions.length === 0 ? null : _React$Component$PropTypes$findDOMNode2['default'].createElement(
              'div',
              { className: 'react-autosuggest__suggestions-section',
                key: 'section-' + sectionIndex },
              sectionName,
              _React$Component$PropTypes$findDOMNode2['default'].createElement(
                'ul',
                { className: 'react-autosuggest__suggestions-section-suggestions' },
                _this4.renderSuggestionsList(section.suggestions, sectionIndex)
              )
            );
          })
        );
      }

      return _React$Component$PropTypes$findDOMNode2['default'].createElement(
        'ul',
        { id: 'react-autosuggest-' + this.id,
          className: 'react-autosuggest__suggestions',
          role: 'listbox' },
        this.renderSuggestionsList(this.state.suggestions, null)
      );
    }
  }, {
    key: 'render',
    value: function render() {
      var ariaActivedescendant = this.getSuggestionId(this.state.focusedSectionIndex, this.state.focusedSuggestionIndex);

      return _React$Component$PropTypes$findDOMNode2['default'].createElement(
        'div',
        { className: 'react-autosuggest' },
        _React$Component$PropTypes$findDOMNode2['default'].createElement('input', _extends({}, this.props.inputAttributes, {
          type: 'text',
          value: this.state.value,
          autoComplete: 'off',
          role: 'combobox',
          'aria-autocomplete': 'list',
          'aria-owns': 'react-autosuggest-' + this.id,
          'aria-expanded': this.state.suggestions !== null,
          'aria-activedescendant': ariaActivedescendant,
          ref: 'input',
          onChange: this.onInputChange.bind(this),
          onKeyDown: this.onInputKeyDown.bind(this),
          onBlur: this.onInputBlur.bind(this) })),
        this.renderSuggestions()
      );
    }
  }], [{
    key: 'propTypes',
    value: {
      suggestions: _React$Component$PropTypes$findDOMNode.PropTypes.func.isRequired, // Function to get the suggestions
      suggestionRenderer: _React$Component$PropTypes$findDOMNode.PropTypes.func, // Function that renders a given suggestion (must be implemented when suggestions are objects)
      suggestionValue: _React$Component$PropTypes$findDOMNode.PropTypes.func, // Function that maps suggestion object to input value (must be implemented when suggestions are objects)
      showWhen: _React$Component$PropTypes$findDOMNode.PropTypes.func, // Function that determines whether to show suggestions or not
      onSuggestionSelected: _React$Component$PropTypes$findDOMNode.PropTypes.func, // This function is called when suggestion is selected via mouse click or Enter
      inputAttributes: _React$Component$PropTypes$findDOMNode.PropTypes.objectOf(_React$Component$PropTypes$findDOMNode.PropTypes.string) // Attributes to pass to the input field (e.g. { id: 'my-input', className: 'sweet autosuggest' })
    },
    enumerable: true
  }, {
    key: 'defaultProps',
    value: {
      showWhen: function showWhen(input) {
        return input.trim().length > 0;
      },
      onSuggestionSelected: function onSuggestionSelected() {},
      inputAttributes: {}
    },
    enumerable: true
  }]);

  return Autosuggest;
})(_React$Component$PropTypes$findDOMNode.Component);

exports['default'] = Autosuggest;
module.exports = exports['default'];
