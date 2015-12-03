'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _redux = require('redux');

var _reactRedux = require('react-redux');

var _redux2 = require('./redux');

var _redux3 = _interopRequireDefault(_redux2);

var _Autosuggest = require('Autosuggest');

var _Autosuggest2 = _interopRequireDefault(_Autosuggest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AutosuggestContainer = (function (_Component) {
  _inherits(AutosuggestContainer, _Component);

  function AutosuggestContainer(props) {
    _classCallCheck(this, AutosuggestContainer);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(AutosuggestContainer).call(this, props));

    var shouldRenderSuggestions = props.shouldRenderSuggestions;
    var suggestions = props.suggestions;
    var inputProps = props.inputProps;

    var initialState = {
      isFocused: false,
      isCollapsed: true,
      focusedSectionIndex: null,
      focusedSuggestionIndex: null,
      valueBeforeUpDown: null
    };

    _this.store = (0, _redux.createStore)(_redux3.default, initialState);
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
      var theme = _props.theme;

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
          theme: theme })
      );
    }
  }]);

  return AutosuggestContainer;
})(_react.Component);

AutosuggestContainer.propTypes = {
  suggestions: _react.PropTypes.array.isRequired,
  getSuggestionValue: _react.PropTypes.func.isRequired,
  renderSuggestion: _react.PropTypes.func.isRequired,
  inputProps: function inputProps(props, propName, componentName) {
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
  theme: _react.PropTypes.object
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

  theme: {
    container: 'react-autosuggest__container',
    'container--open': 'react-autosuggest__container--open',
    input: 'react-autosuggest__input',
    'items-container': 'react-autosuggest__suggestions-container',
    item: 'react-autosuggest__item',
    'item--focused': 'react-autosuggest__item--focused',
    'section-container': 'react-autosuggest__section-container',
    'section-title': 'react-autosuggest__section-title',
    'section-items-container': 'react-autosuggest__section-suggestions-container'
  }
};
exports.default = AutosuggestContainer;