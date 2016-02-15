'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _reducerAndActions = require('./reducerAndActions');

var _reactAutowhatever = require('react-autowhatever');

var _reactAutowhatever2 = _interopRequireDefault(_reactAutowhatever);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function mapStateToProps(state) {
  return {
    isFocused: state.isFocused,
    isCollapsed: state.isCollapsed,
    focusedSectionIndex: state.focusedSectionIndex,
    focusedSuggestionIndex: state.focusedSuggestionIndex,
    valueBeforeUpDown: state.valueBeforeUpDown,
    lastAction: state.lastAction
  };
}

function mapDispatchToProps(dispatch) {
  return {
    inputFocused: function inputFocused(shouldRenderSuggestions) {
      dispatch((0, _reducerAndActions.inputFocused)(shouldRenderSuggestions));
    },
    inputBlurred: function inputBlurred() {
      dispatch((0, _reducerAndActions.inputBlurred)());
    },
    inputChanged: function inputChanged(shouldRenderSuggestions, lastAction) {
      dispatch((0, _reducerAndActions.inputChanged)(shouldRenderSuggestions, lastAction));
    },
    updateFocusedSuggestion: function updateFocusedSuggestion(sectionIndex, suggestionIndex, value) {
      dispatch((0, _reducerAndActions.updateFocusedSuggestion)(sectionIndex, suggestionIndex, value));
    },
    revealSuggestions: function revealSuggestions() {
      dispatch((0, _reducerAndActions.revealSuggestions)());
    },
    closeSuggestions: function closeSuggestions(lastAction) {
      dispatch((0, _reducerAndActions.closeSuggestions)(lastAction));
    }
  };
}

var Autosuggest = function (_Component) {
  _inherits(Autosuggest, _Component);

  function Autosuggest() {
    _classCallCheck(this, Autosuggest);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(Autosuggest).call(this));

    _this.saveInput = _this.saveInput.bind(_this);
    return _this;
  }

  _createClass(Autosuggest, [{
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if (nextProps.suggestions !== this.props.suggestions) {
        var suggestions = nextProps.suggestions;
        var inputProps = nextProps.inputProps;
        var shouldRenderSuggestions = nextProps.shouldRenderSuggestions;
        var isCollapsed = nextProps.isCollapsed;
        var revealSuggestions = nextProps.revealSuggestions;
        var lastAction = nextProps.lastAction;
        var value = inputProps.value;


        if (isCollapsed && lastAction !== 'click' && lastAction !== 'enter' && suggestions.length > 0 && shouldRenderSuggestions(value)) {
          revealSuggestions();
        }
      }
    }
  }, {
    key: 'getSuggestion',
    value: function getSuggestion(sectionIndex, suggestionIndex) {
      var _props = this.props;
      var suggestions = _props.suggestions;
      var multiSection = _props.multiSection;
      var getSectionSuggestions = _props.getSectionSuggestions;


      if (multiSection) {
        return getSectionSuggestions(suggestions[sectionIndex])[suggestionIndex];
      }

      return suggestions[suggestionIndex];
    }
  }, {
    key: 'getFocusedSuggestion',
    value: function getFocusedSuggestion() {
      var _props2 = this.props;
      var focusedSectionIndex = _props2.focusedSectionIndex;
      var focusedSuggestionIndex = _props2.focusedSuggestionIndex;


      if (focusedSuggestionIndex === null) {
        return null;
      }

      return this.getSuggestion(focusedSectionIndex, focusedSuggestionIndex);
    }
  }, {
    key: 'getSuggestionValueByIndex',
    value: function getSuggestionValueByIndex(sectionIndex, suggestionIndex) {
      var getSuggestionValue = this.props.getSuggestionValue;


      return getSuggestionValue(this.getSuggestion(sectionIndex, suggestionIndex));
    }
  }, {
    key: 'getSuggestionIndices',
    value: function getSuggestionIndices(suggestionElement) {
      var sectionIndex = suggestionElement.getAttribute('data-section-index');
      var suggestionIndex = suggestionElement.getAttribute('data-suggestion-index');

      return {
        sectionIndex: typeof sectionIndex === 'string' ? parseInt(sectionIndex, 10) : null,
        suggestionIndex: parseInt(suggestionIndex, 10)
      };
    }
  }, {
    key: 'findSuggestionElement',
    value: function findSuggestionElement(startNode) {
      var node = startNode;

      do {
        if (node.getAttribute('data-suggestion-index') !== null) {
          return node;
        }

        node = node.parentNode;
      } while (node !== null);

      console.error('Clicked element:', startNode); // eslint-disable-line no-console
      throw new Error('Couldn\'t find suggestion element');
    }
  }, {
    key: 'maybeEmitOnChange',
    value: function maybeEmitOnChange(event, newValue, method) {
      var _props$inputProps = this.props.inputProps;
      var value = _props$inputProps.value;
      var onChange = _props$inputProps.onChange;


      if (newValue !== value) {
        onChange && onChange(event, { newValue: newValue, method: method });
      }
    }
  }, {
    key: 'willRenderSuggestions',
    value: function willRenderSuggestions() {
      var _props3 = this.props;
      var suggestions = _props3.suggestions;
      var inputProps = _props3.inputProps;
      var shouldRenderSuggestions = _props3.shouldRenderSuggestions;
      var value = inputProps.value;


      return suggestions.length > 0 && shouldRenderSuggestions(value);
    }
  }, {
    key: 'saveInput',
    value: function saveInput(autowhatever) {
      if (autowhatever !== null) {
        var input = autowhatever.refs.input;

        this.input = input;
        this.props.inputRef(input);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props4 = this.props;
      var suggestions = _props4.suggestions;
      var onSuggestionsUpdateRequested = _props4.onSuggestionsUpdateRequested;
      var renderSuggestion = _props4.renderSuggestion;
      var inputProps = _props4.inputProps;
      var shouldRenderSuggestions = _props4.shouldRenderSuggestions;
      var onSuggestionSelected = _props4.onSuggestionSelected;
      var multiSection = _props4.multiSection;
      var renderSectionTitle = _props4.renderSectionTitle;
      var id = _props4.id;
      var getSectionSuggestions = _props4.getSectionSuggestions;
      var focusInputOnSuggestionClick = _props4.focusInputOnSuggestionClick;
      var theme = _props4.theme;
      var isFocused = _props4.isFocused;
      var isCollapsed = _props4.isCollapsed;
      var focusedSectionIndex = _props4.focusedSectionIndex;
      var focusedSuggestionIndex = _props4.focusedSuggestionIndex;
      var valueBeforeUpDown = _props4.valueBeforeUpDown;
      var inputFocused = _props4.inputFocused;
      var inputBlurred = _props4.inputBlurred;
      var inputChanged = _props4.inputChanged;
      var updateFocusedSuggestion = _props4.updateFocusedSuggestion;
      var revealSuggestions = _props4.revealSuggestions;
      var closeSuggestions = _props4.closeSuggestions;
      var value = inputProps.value;
      var _onBlur = inputProps.onBlur;
      var _onFocus = inputProps.onFocus;
      var _onKeyDown = inputProps.onKeyDown;

      var isOpen = isFocused && !isCollapsed && this.willRenderSuggestions();
      var items = isOpen ? suggestions : [];
      var autowhateverInputProps = _extends({}, inputProps, {
        onFocus: function onFocus(event) {
          if (!_this2.justClickedOnSuggestion) {
            inputFocused(shouldRenderSuggestions(value));
            _onFocus && _onFocus(event);
          }
        },
        onBlur: function onBlur(event) {
          _this2.onBlurEvent = event;

          if (!_this2.justClickedOnSuggestion) {
            inputBlurred();
            _onBlur && _onBlur(event);

            if (valueBeforeUpDown !== null && value !== valueBeforeUpDown) {
              onSuggestionsUpdateRequested({ value: value, reason: 'blur' });
            }
          }
        },
        onChange: function onChange(event) {
          var value = event.target.value;
          var _props5 = _this2.props;
          var shouldRenderSuggestions = _props5.shouldRenderSuggestions;
          var onSuggestionsUpdateRequested = _props5.onSuggestionsUpdateRequested;


          _this2.maybeEmitOnChange(event, value, 'type');
          inputChanged(shouldRenderSuggestions(value), 'type');
          onSuggestionsUpdateRequested({ value: value, reason: 'type' });
        },
        onKeyDown: function onKeyDown(event, data) {
          switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
              if (isCollapsed) {
                if (_this2.willRenderSuggestions()) {
                  revealSuggestions();
                }
              } else if (suggestions.length > 0) {
                var newFocusedSectionIndex = data.newFocusedSectionIndex;
                var newFocusedItemIndex = data.newFocusedItemIndex;

                var newValue = newFocusedItemIndex === null ? valueBeforeUpDown : _this2.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex);

                updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, value);
                _this2.maybeEmitOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
              }
              event.preventDefault();
              break;

            case 'Enter':
              {
                var focusedSuggestion = _this2.getFocusedSuggestion();

                if (focusedSuggestion !== null) {
                  closeSuggestions('enter');
                  onSuggestionSelected(event, {
                    suggestion: focusedSuggestion,
                    suggestionValue: value,
                    method: 'enter'
                  });
                  onSuggestionsUpdateRequested({ value: value, reason: 'enter' });
                }
                break;
              }

            case 'Escape':
              if (isOpen) {
                // If input.type === 'search', the browser clears the input
                // when Escape is pressed. We want to disable this default
                // behaviour so that, when suggestions are shown, we just hide
                // them, without clearing the input.
                event.preventDefault();
              }

              if (valueBeforeUpDown === null) {
                // Didn't interact with Up/Down
                if (!isOpen) {
                  _this2.maybeEmitOnChange(event, '', 'escape');
                  onSuggestionsUpdateRequested({ value: '', reason: 'escape' });
                }
              } else {
                // Interacted with Up/Down
                _this2.maybeEmitOnChange(event, valueBeforeUpDown, 'escape');
              }

              closeSuggestions('escape');
              break;
          }

          _onKeyDown && _onKeyDown(event);
        }
      });
      var onMouseEnter = function onMouseEnter(event, _ref) {
        var sectionIndex = _ref.sectionIndex;
        var itemIndex = _ref.itemIndex;

        updateFocusedSuggestion(sectionIndex, itemIndex);
      };
      var onMouseLeave = function onMouseLeave() {
        updateFocusedSuggestion(null, null);
      };
      var onMouseDown = function onMouseDown() {
        _this2.justClickedOnSuggestion = true;
      };
      var onClick = function onClick(event) {
        var _getSuggestionIndices = _this2.getSuggestionIndices(_this2.findSuggestionElement(event.target));

        var sectionIndex = _getSuggestionIndices.sectionIndex;
        var suggestionIndex = _getSuggestionIndices.suggestionIndex;

        var clickedSuggestion = _this2.getSuggestion(sectionIndex, suggestionIndex);
        var clickedSuggestionValue = _this2.props.getSuggestionValue(clickedSuggestion);

        _this2.maybeEmitOnChange(event, clickedSuggestionValue, 'click');
        onSuggestionSelected(event, {
          suggestion: clickedSuggestion,
          suggestionValue: clickedSuggestionValue,
          method: 'click'
        });
        closeSuggestions('click');

        if (focusInputOnSuggestionClick === true) {
          _this2.input.focus();
        } else {
          inputBlurred();
          _onBlur && _onBlur(_this2.onBlurEvent);
        }

        onSuggestionsUpdateRequested({ value: clickedSuggestionValue, reason: 'click' });

        _this2.justClickedOnSuggestion = false;
      };
      var itemProps = function itemProps(_ref2) {
        var sectionIndex = _ref2.sectionIndex;
        var itemIndex = _ref2.itemIndex;

        return {
          'data-section-index': sectionIndex,
          'data-suggestion-index': itemIndex,
          onMouseEnter: onMouseEnter,
          onMouseLeave: onMouseLeave,
          onMouseDown: onMouseDown,
          onTouchStart: onMouseDown, // Because on iOS `onMouseDown` is not triggered
          onClick: onClick
        };
      };
      var renderItem = function renderItem(item) {
        return renderSuggestion(item, { value: value, valueBeforeUpDown: valueBeforeUpDown });
      };

      return _react2.default.createElement(_reactAutowhatever2.default, { multiSection: multiSection,
        items: items,
        renderItem: renderItem,
        renderSectionTitle: renderSectionTitle,
        getSectionItems: getSectionSuggestions,
        focusedSectionIndex: focusedSectionIndex,
        focusedItemIndex: focusedSuggestionIndex,
        inputProps: autowhateverInputProps,
        itemProps: itemProps,
        theme: theme,
        id: id,
        ref: this.saveInput });
    }
  }]);

  return Autosuggest;
}(_react.Component);

Autosuggest.propTypes = {
  suggestions: _react.PropTypes.array.isRequired,
  onSuggestionsUpdateRequested: _react.PropTypes.func.isRequired,
  getSuggestionValue: _react.PropTypes.func.isRequired,
  renderSuggestion: _react.PropTypes.func.isRequired,
  inputProps: _react.PropTypes.object.isRequired,
  shouldRenderSuggestions: _react.PropTypes.func.isRequired,
  onSuggestionSelected: _react.PropTypes.func.isRequired,
  multiSection: _react.PropTypes.bool.isRequired,
  renderSectionTitle: _react.PropTypes.func.isRequired,
  getSectionSuggestions: _react.PropTypes.func.isRequired,
  focusInputOnSuggestionClick: _react.PropTypes.bool.isRequired,
  theme: _react.PropTypes.object.isRequired,
  id: _react.PropTypes.string.isRequired,
  inputRef: _react.PropTypes.func.isRequired,

  isFocused: _react.PropTypes.bool.isRequired,
  isCollapsed: _react.PropTypes.bool.isRequired,
  focusedSectionIndex: _react.PropTypes.number,
  focusedSuggestionIndex: _react.PropTypes.number,
  valueBeforeUpDown: _react.PropTypes.string,
  lastAction: _react.PropTypes.string,

  inputFocused: _react.PropTypes.func.isRequired,
  inputBlurred: _react.PropTypes.func.isRequired,
  inputChanged: _react.PropTypes.func.isRequired,
  updateFocusedSuggestion: _react.PropTypes.func.isRequired,
  revealSuggestions: _react.PropTypes.func.isRequired,
  closeSuggestions: _react.PropTypes.func.isRequired
};
exports.default = (0, _reactRedux.connect)(mapStateToProps, mapDispatchToProps)(Autosuggest);