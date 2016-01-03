'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _reducerAndActions = require('./reducerAndActions');

var _reducerAndActions2 = _interopRequireDefault(_reducerAndActions);

var _Autosuggest = require('./Autosuggest');

var _Autosuggest2 = _interopRequireDefault(_Autosuggest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var defaultTheme = {
  container: 'react-autosuggest__container',
  'container--open': 'react-autosuggest__container--open',
  input: 'react-autosuggest__input',
  'suggestions-container': 'react-autosuggest__suggestions-container',
  suggestion: 'react-autosuggest__suggestion',
  'suggestion--focused': 'react-autosuggest__suggestion--focused',
  'section-container': 'react-autosuggest__section-container',
  'section-title': 'react-autosuggest__section-title',
  'section-suggestions-container': 'react-autosuggest__section-suggestions-container'
};

function mapToAutowhateverTheme(theme) {
  var result = {};

  for (var key in theme) {
    switch (key) {
      case 'suggestions-container':
        result['items-container'] = theme[key];
        break;

      case 'suggestion':
        result['item'] = theme[key];
        break;

      case 'suggestion--focused':
        result['item--focused'] = theme[key];
        break;

      case 'section-suggestions-container':
        result['section-items-container'] = theme[key];
        break;

      default:
        result[key] = theme[key];
    }
  }

  return result;
}

var AutosuggestContainer = (function (_Component) {
  _inherits(AutosuggestContainer, _Component);

  function AutosuggestContainer(props) {
    _classCallCheck(this, AutosuggestContainer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AutosuggestContainer).call(this, props));

    var initialState = {
      isFocused: false,
      isCollapsed: true,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null,
      lastAction: null
    };

    _this.store = (0, _redux.createStore)(_reducerAndActions2.default, initialState);
    _this.theme = mapToAutowhateverTheme(_this.props.theme);
    return _this;
  }

  _createClass(AutosuggestContainer, [{
    key: 'render',
    value: function render() {
      var _props = this.props;
      var multiSection = _props.multiSection;
      var shouldRenderSuggestions = _props.shouldRenderSuggestions;
      var suggestions = _props.suggestions;
      var getSuggestionValue = _props.getSuggestionValue;
      var renderSuggestion = _props.renderSuggestion;
      var renderSectionTitle = _props.renderSectionTitle;
      var getSectionSuggestions = _props.getSectionSuggestions;
      var inputProps = _props.inputProps;
      var onSuggestionSelected = _props.onSuggestionSelected;
      var focusInputOnSuggestionClick = _props.focusInputOnSuggestionClick;
      var id = _props.id;

      return _react2.default.createElement(
        _reactRedux.Provider,
        { store: this.store },
        _react2.default.createElement(_Autosuggest2.default, { multiSection: multiSection,
          shouldRenderSuggestions: shouldRenderSuggestions,
          suggestions: suggestions,
          getSuggestionValue: getSuggestionValue,
          renderSuggestion: renderSuggestion,
          renderSectionTitle: renderSectionTitle,
          getSectionSuggestions: getSectionSuggestions,
          inputProps: inputProps,
          onSuggestionSelected: onSuggestionSelected,
          focusInputOnSuggestionClick: focusInputOnSuggestionClick,
          theme: this.theme,
          id: id })
      );
    }
  }]);

  return AutosuggestContainer;
})(_react.Component);

AutosuggestContainer.propTypes = {
  suggestions: _react.PropTypes.array.isRequired,
  getSuggestionValue: _react.PropTypes.func.isRequired,
  renderSuggestion: _react.PropTypes.func.isRequired,
  inputProps: function inputProps(props, propName) {
    var inputProps = props[propName];

    if (!('value' in inputProps)) {
      throw new Error('\'inputProps\' must have \'value\'.');
    }

    if (!('onChange' in inputProps)) {
      throw new Error('\'inputProps\' must have \'onChange\'.');
    }
  },
  shouldRenderSuggestions: _react.PropTypes.func,
  onSuggestionSelected: _react.PropTypes.func,
  multiSection: _react.PropTypes.bool,
  renderSectionTitle: _react.PropTypes.func,
  getSectionSuggestions: _react.PropTypes.func,
  focusInputOnSuggestionClick: _react.PropTypes.bool,
  theme: _react.PropTypes.object,
  id: _react.PropTypes.string
};
AutosuggestContainer.defaultProps = {
  shouldRenderSuggestions: function shouldRenderSuggestions(value) {
    return value.trim().length > 0;
  },
  onSuggestionSelected: function onSuggestionSelected() {},
  multiSection: false,
  renderSectionTitle: function renderSectionTitle() {
    throw new Error('`renderSectionTitle` must be provided');
  },
  getSectionSuggestions: function getSectionSuggestions() {
    throw new Error('`getSectionSuggestions` must be provided');
  },

  focusInputOnSuggestionClick: true,
  theme: defaultTheme,
  id: '1'
};
exports.default = AutosuggestContainer;