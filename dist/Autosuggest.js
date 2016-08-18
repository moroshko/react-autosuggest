'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactRedux = require('react-redux');

var _arrays = require('shallow-equal/arrays');

var _arrays2 = _interopRequireDefault(_arrays);

var _redux = require('./redux');

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

var Autosuggest = function (_Component) {
  _inherits(Autosuggest, _Component);

  function Autosuggest() {
    var _Object$getPrototypeO;

    var _temp, _this, _ret;

    _classCallCheck(this, Autosuggest);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(Autosuggest)).call.apply(_Object$getPrototypeO, [this].concat(args))), _this), _this.onDocumentMouseDown = function (event) {
      _this.justClickedOnSuggestionsContainer = false;

      var node = event.detail.target || // This is for testing only. Please show be a better way to emulate this.
      event.target;

      do {
        if (node.getAttribute('data-suggestion-index') !== null) {
          // Suggestion was clicked
          return;
        }

        if (node === _this.suggestionsContainer) {
          // Something else inside suggestions container was clicked
          _this.justClickedOnSuggestionsContainer = true;
          return;
        }

        node = node.parentNode;
      } while (node !== document);
    }, _this.storeReferences = function (autowhatever) {
      if (autowhatever !== null) {
        var input = autowhatever.input;


        _this.input = input;
        _this.props.inputRef(input);

        _this.suggestionsContainer = autowhatever.itemsContainer;
      }
    }, _this.onSuggestionMouseEnter = function (event, _ref) {
      var sectionIndex = _ref.sectionIndex;
      var itemIndex = _ref.itemIndex;

      _this.props.updateFocusedSuggestion(sectionIndex, itemIndex);
    }, _this.onSuggestionMouseLeave = function () {
      _this.props.updateFocusedSuggestion(null, null);
    }, _this.onSuggestionMouseDown = function () {
      _this.justClickedOnSuggestion = true;
    }, _this.onSuggestionClick = function (event) {
      var _this$props = _this.props;
      var onSuggestionSelected = _this$props.onSuggestionSelected;
      var focusInputOnSuggestionClick = _this$props.focusInputOnSuggestionClick;
      var closeSuggestions = _this$props.closeSuggestions;

      var _this$getSuggestionIn = _this.getSuggestionIndices(_this.findSuggestionElement(event.target));

      var sectionIndex = _this$getSuggestionIn.sectionIndex;
      var suggestionIndex = _this$getSuggestionIn.suggestionIndex;

      var clickedSuggestion = _this.getSuggestion(sectionIndex, suggestionIndex);
      var clickedSuggestionValue = _this.props.getSuggestionValue(clickedSuggestion);

      _this.maybeCallOnChange(event, clickedSuggestionValue, 'click');
      onSuggestionSelected(event, {
        suggestion: clickedSuggestion,
        suggestionValue: clickedSuggestionValue,
        sectionIndex: sectionIndex,
        method: 'click'
      });
      closeSuggestions('click');

      if (focusInputOnSuggestionClick === true) {
        _this.input.focus();
      } else {
        _this.onBlur();
      }

      _this.maybeCallOnSuggestionsUpdateRequested({ value: clickedSuggestionValue, reason: 'click' });

      setTimeout(function () {
        _this.justClickedOnSuggestion = false;
      });
    }, _this.onBlur = function () {
      var _this$props2 = _this.props;
      var inputProps = _this$props2.inputProps;
      var shouldRenderSuggestions = _this$props2.shouldRenderSuggestions;
      var inputBlurred = _this$props2.inputBlurred;
      var value = inputProps.value;
      var onBlur = inputProps.onBlur;

      var focusedSuggestion = _this.getFocusedSuggestion();

      inputBlurred(shouldRenderSuggestions(value));
      onBlur && onBlur(_this.blurEvent, { focusedSuggestion: focusedSuggestion });
    }, _this.itemProps = function (_ref2) {
      var sectionIndex = _ref2.sectionIndex;
      var itemIndex = _ref2.itemIndex;

      return {
        'data-section-index': sectionIndex,
        'data-suggestion-index': itemIndex,
        onMouseEnter: _this.onSuggestionMouseEnter,
        onMouseLeave: _this.onSuggestionMouseLeave,
        onMouseDown: _this.onSuggestionMouseDown,
        onTouchStart: _this.onSuggestionMouseDown, // Because on iOS `onMouseDown` is not triggered
        onClick: _this.onSuggestionClick
      };
    }, _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Autosuggest, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      document.addEventListener('mousedown', this.onDocumentMouseDown);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      if ((0, _arrays2.default)(nextProps.suggestions, this.props.suggestions)) {
        var suggestionsBecomeVisible = !this.willRenderSuggestions(this.props) && this.willRenderSuggestions(nextProps);

        if (suggestionsBecomeVisible) {
          this.maybeFocusFirstSuggestion();
        }
      } else {
        if (this.willRenderSuggestions(nextProps)) {
          this.maybeFocusFirstSuggestion();

          var isCollapsed = nextProps.isCollapsed;
          var revealSuggestions = nextProps.revealSuggestions;
          var lastAction = nextProps.lastAction;


          if (isCollapsed && lastAction !== 'click' && lastAction !== 'enter') {
            revealSuggestions();
          }
        }
      }
    }
  }, {
    key: 'componentWillUnmount',
    value: function componentWillUnmount() {
      document.removeEventListener('mousedown', this.onDocumentMouseDown);
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
    key: 'maybeCallOnChange',
    value: function maybeCallOnChange(event, newValue, method) {
      var _props$inputProps = this.props.inputProps;
      var value = _props$inputProps.value;
      var onChange = _props$inputProps.onChange;


      if (newValue !== value) {
        onChange && onChange(event, { newValue: newValue, method: method });
      }
    }
  }, {
    key: 'maybeCallOnSuggestionsUpdateRequested',
    value: function maybeCallOnSuggestionsUpdateRequested(data) {
      var _props3 = this.props;
      var onSuggestionsUpdateRequested = _props3.onSuggestionsUpdateRequested;
      var shouldRenderSuggestions = _props3.shouldRenderSuggestions;


      if (shouldRenderSuggestions(data.value)) {
        onSuggestionsUpdateRequested(data);
      }
    }
  }, {
    key: 'maybeFocusFirstSuggestion',
    value: function maybeFocusFirstSuggestion() {
      var _props4 = this.props;
      var focusFirstSuggestion = _props4.focusFirstSuggestion;
      var multiSection = _props4.multiSection;
      var updateFocusedSuggestion = _props4.updateFocusedSuggestion;


      if (focusFirstSuggestion) {
        updateFocusedSuggestion(multiSection ? 0 : null, 0);
      }
    }
  }, {
    key: 'willRenderSuggestions',
    value: function willRenderSuggestions(props) {
      var suggestions = props.suggestions;
      var inputProps = props.inputProps;
      var shouldRenderSuggestions = props.shouldRenderSuggestions;
      var value = inputProps.value;


      return suggestions.length > 0 && shouldRenderSuggestions(value);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this2 = this;

      var _props5 = this.props;
      var suggestions = _props5.suggestions;
      var renderSuggestionsContainer = _props5.renderSuggestionsContainer;
      var renderSuggestion = _props5.renderSuggestion;
      var inputProps = _props5.inputProps;
      var shouldRenderSuggestions = _props5.shouldRenderSuggestions;
      var onSuggestionSelected = _props5.onSuggestionSelected;
      var multiSection = _props5.multiSection;
      var renderSectionTitle = _props5.renderSectionTitle;
      var id = _props5.id;
      var getSectionSuggestions = _props5.getSectionSuggestions;
      var theme = _props5.theme;
      var isFocused = _props5.isFocused;
      var isCollapsed = _props5.isCollapsed;
      var focusedSectionIndex = _props5.focusedSectionIndex;
      var focusedSuggestionIndex = _props5.focusedSuggestionIndex;
      var valueBeforeUpDown = _props5.valueBeforeUpDown;
      var inputFocused = _props5.inputFocused;
      var inputChanged = _props5.inputChanged;
      var updateFocusedSuggestion = _props5.updateFocusedSuggestion;
      var revealSuggestions = _props5.revealSuggestions;
      var closeSuggestions = _props5.closeSuggestions;
      var getSuggestionValue = _props5.getSuggestionValue;
      var alwaysRenderSuggestions = _props5.alwaysRenderSuggestions;
      var value = inputProps.value;
      var _onFocus = inputProps.onFocus;
      var _onKeyDown = inputProps.onKeyDown;

      var willRenderSuggestions = this.willRenderSuggestions(this.props);
      var isOpen = alwaysRenderSuggestions || isFocused && !isCollapsed && willRenderSuggestions;
      var items = isOpen ? suggestions : [];
      var autowhateverInputProps = _extends({}, inputProps, {
        onFocus: function onFocus(event) {
          if (!_this2.justClickedOnSuggestion && !_this2.justClickedOnSuggestionsContainer) {
            inputFocused(shouldRenderSuggestions(value));
            _onFocus && _onFocus(event);

            if (suggestions.length > 0) {
              _this2.maybeFocusFirstSuggestion();
            }
          }
        },
        onBlur: function onBlur(event) {
          if (_this2.justClickedOnSuggestionsContainer) {
            _this2.input.focus();
            return;
          }

          _this2.blurEvent = event;

          if (!_this2.justClickedOnSuggestion) {
            _this2.onBlur();

            if (valueBeforeUpDown !== null && value !== valueBeforeUpDown) {
              _this2.maybeCallOnSuggestionsUpdateRequested({ value: value, reason: 'blur' });
            }
          }
        },
        onChange: function onChange(event) {
          var value = event.target.value;
          var shouldRenderSuggestions = _this2.props.shouldRenderSuggestions;


          _this2.maybeCallOnChange(event, value, 'type');
          inputChanged(shouldRenderSuggestions(value), 'type');
          _this2.maybeCallOnSuggestionsUpdateRequested({ value: value, reason: 'type' });
        },
        onKeyDown: function onKeyDown(event, data) {
          switch (event.key) {
            case 'ArrowDown':
            case 'ArrowUp':
              if (isCollapsed) {
                if (willRenderSuggestions) {
                  revealSuggestions();
                }
              } else if (suggestions.length > 0) {
                var newFocusedSectionIndex = data.newFocusedSectionIndex;
                var newFocusedItemIndex = data.newFocusedItemIndex;


                var newValue = void 0;

                if (newFocusedItemIndex === null) {
                  // valueBeforeUpDown can be null if, for example, user
                  // hovers on the first suggestion and then pressed Up.
                  // If that happens, use the original input value.
                  newValue = valueBeforeUpDown === null ? value : valueBeforeUpDown;
                } else {
                  newValue = _this2.getSuggestionValueByIndex(newFocusedSectionIndex, newFocusedItemIndex);
                }

                updateFocusedSuggestion(newFocusedSectionIndex, newFocusedItemIndex, value);
                _this2.maybeCallOnChange(event, newValue, event.key === 'ArrowDown' ? 'down' : 'up');
              }
              event.preventDefault();
              break;

            case 'Enter':
              {
                var focusedSuggestion = _this2.getFocusedSuggestion();

                if (isOpen && !alwaysRenderSuggestions) {
                  closeSuggestions('enter');
                }

                if (focusedSuggestion !== null) {
                  var _newValue = getSuggestionValue(focusedSuggestion);

                  onSuggestionSelected(event, {
                    suggestion: focusedSuggestion,
                    suggestionValue: _newValue,
                    sectionIndex: focusedSectionIndex,
                    method: 'enter'
                  });

                  _this2.maybeCallOnChange(event, _newValue, 'enter');
                  _this2.maybeCallOnSuggestionsUpdateRequested({ value: _newValue, reason: 'enter' });
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
                if (alwaysRenderSuggestions || !isOpen) {
                  _this2.maybeCallOnChange(event, '', 'escape');
                  _this2.maybeCallOnSuggestionsUpdateRequested({ value: '', reason: 'escape' });
                }
              } else {
                // Interacted with Up/Down
                _this2.maybeCallOnChange(event, valueBeforeUpDown, 'escape');
              }

              if (isOpen && !alwaysRenderSuggestions) {
                closeSuggestions('escape');
              } else {
                updateFocusedSuggestion(null, null);
              }

              break;
          }

          _onKeyDown && _onKeyDown(event);
        }
      });
      var renderSuggestionData = {
        query: (valueBeforeUpDown || value).trim()
      };

      return _react2.default.createElement(_reactAutowhatever2.default, {
        multiSection: multiSection,
        items: items,
        renderItemsContainer: renderSuggestionsContainer,
        renderItem: renderSuggestion,
        renderItemData: renderSuggestionData,
        renderSectionTitle: renderSectionTitle,
        getSectionItems: getSectionSuggestions,
        focusedSectionIndex: focusedSectionIndex,
        focusedItemIndex: focusedSuggestionIndex,
        inputProps: autowhateverInputProps,
        itemProps: this.itemProps,
        theme: theme,
        id: id,
        ref: this.storeReferences });
    }
  }]);

  return Autosuggest;
}(_react.Component);

Autosuggest.propTypes = {
  suggestions: _react.PropTypes.array.isRequired,
  renderSuggestionsContainer: _react.PropTypes.func,
  onSuggestionsUpdateRequested: _react.PropTypes.func.isRequired,
  getSuggestionValue: _react.PropTypes.func.isRequired,
  renderSuggestion: _react.PropTypes.func.isRequired,
  inputProps: _react.PropTypes.object.isRequired,
  shouldRenderSuggestions: _react.PropTypes.func.isRequired,
  alwaysRenderSuggestions: _react.PropTypes.bool.isRequired,
  onSuggestionSelected: _react.PropTypes.func.isRequired,
  multiSection: _react.PropTypes.bool.isRequired,
  renderSectionTitle: _react.PropTypes.func.isRequired,
  getSectionSuggestions: _react.PropTypes.func.isRequired,
  focusInputOnSuggestionClick: _react.PropTypes.bool.isRequired,
  focusFirstSuggestion: _react.PropTypes.bool.isRequired,
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
exports.default = (0, _reactRedux.connect)(mapStateToProps, _redux.actionCreators)(Autosuggest);