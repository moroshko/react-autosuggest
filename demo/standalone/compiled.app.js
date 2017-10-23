/******/ (function(modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/ var installedModules = {}; // The require function

  /******/ /******/ function __webpack_require__(moduleId) {
    /******/ // Check if module is in cache
    /******/ if (installedModules[moduleId])
      /******/ return installedModules[moduleId].exports; // Create a new module (and put it into the cache)

    /******/ /******/ var module = (installedModules[moduleId] = {
      /******/ exports: {},
      /******/ id: moduleId,
      /******/ loaded: false
      /******/
    }); // Execute the module function

    /******/ /******/ modules[moduleId].call(
      module.exports,
      module,
      module.exports,
      __webpack_require__
    ); // Flag the module as loaded

    /******/ /******/ module.loaded = true; // Return the exports of the module

    /******/ /******/ return module.exports;
    /******/
  } // expose the modules object (__webpack_modules__)

  /******/ /******/ __webpack_require__.m = modules; // expose the module cache

  /******/ /******/ __webpack_require__.c = installedModules; // __webpack_public_path__

  /******/ /******/ __webpack_require__.p = ''; // Load entry module and return exports

  /******/ /******/ return __webpack_require__(0);
  /******/
})(
  /************************************************************************/
  /******/ [
    /* 0 */
    /***/ function(module, exports, __webpack_require__) {
      module.exports = __webpack_require__(1);

      /***/
    },
    /* 1 */
    /***/ function(module, exports) {
      'use strict';

      var _createClass = (function() {
        function defineProperties(target, props) {
          for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;
            if ('value' in descriptor) descriptor.writable = true;
            Object.defineProperty(target, descriptor.key, descriptor);
          }
        }
        return function(Constructor, protoProps, staticProps) {
          if (protoProps) defineProperties(Constructor.prototype, protoProps);
          if (staticProps) defineProperties(Constructor, staticProps);
          return Constructor;
        };
      })();

      function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
          throw new TypeError('Cannot call a class as a function');
        }
      }

      function _possibleConstructorReturn(self, call) {
        if (!self) {
          throw new ReferenceError(
            "this hasn't been initialised - super() hasn't been called"
          );
        }
        return call && (typeof call === 'object' || typeof call === 'function')
          ? call
          : self;
      }

      function _inherits(subClass, superClass) {
        if (typeof superClass !== 'function' && superClass !== null) {
          throw new TypeError(
            'Super expression must either be null or a function, not ' +
              typeof superClass
          );
        }
        subClass.prototype = Object.create(superClass && superClass.prototype, {
          constructor: {
            value: subClass,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
        if (superClass)
          Object.setPrototypeOf
            ? Object.setPrototypeOf(subClass, superClass)
            : (subClass.__proto__ = superClass);
      }

      /* eslint-disable react/react-in-jsx-scope */

      var languages = [
        {
          name: 'C',
          year: 1972
        },
        {
          name: 'C#',
          year: 2000
        },
        {
          name: 'C++',
          year: 1983
        },
        {
          name: 'Clojure',
          year: 2007
        },
        {
          name: 'Elm',
          year: 2012
        },
        {
          name: 'Go',
          year: 2009
        },
        {
          name: 'Haskell',
          year: 1990
        },
        {
          name: 'Java',
          year: 1995
        },
        {
          name: 'JavaScript',
          year: 1995
        },
        {
          name: 'Perl',
          year: 1987
        },
        {
          name: 'PHP',
          year: 1995
        },
        {
          name: 'Python',
          year: 1991
        },
        {
          name: 'Ruby',
          year: 1995
        },
        {
          name: 'Scala',
          year: 2003
        }
      ];

      // https://developer.mozilla.org/en/docs/Web/JavaScript/Guide/Regular_Expressions#Using_special_characters
      var escapeRegexCharacters = function escapeRegexCharacters(str) {
        return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      };

      var getSuggestions = function getSuggestions(value) {
        var escapedValue = escapeRegexCharacters(value.trim());

        if (escapedValue === '') {
          return [];
        }

        var regex = new RegExp('^' + escapedValue, 'i');

        return languages.filter(function(language) {
          return regex.test(language.name);
        });
      };

      var getSuggestionValue = function getSuggestionValue(suggestion) {
        return suggestion.name;
      };

      var renderSuggestion = function renderSuggestion(suggestion) {
        return React.createElement('span', null, suggestion.name);
      };

      // prettier-ignore

      var App = function (_React$Component) {
	  _inherits(App, _React$Component);

	  // eslint-disable-line no-undef
	  function App() {
	    _classCallCheck(this, App);

	    var _this = _possibleConstructorReturn(this, (App.__proto__ || Object.getPrototypeOf(App)).call(this));

	    _this.onChange = function (event, _ref) {
	      var newValue = _ref.newValue;

	      _this.setState({
	        value: newValue
	      });
	    };

	    _this.onSuggestionsFetchRequested = function (_ref2) {
	      var value = _ref2.value;

	      _this.setState({
	        suggestions: getSuggestions(value)
	      });
	    };

	    _this.onSuggestionsClearRequested = function () {
	      _this.setState({
	        suggestions: []
	      });
	    };

	    _this.state = {
	      value: '',
	      suggestions: getSuggestions('')
	    };
	    return _this;
	  }

	  _createClass(App, [{
	    key: 'render',
	    value: function render() {
	      var _state = this.state,
	          value = _state.value,
	          suggestions = _state.suggestions;

	      var inputProps = {
	        placeholder: "Type 'c'",
	        value: value,
	        onChange: this.onChange
	      };

	      return React.createElement(Autosuggest // eslint-disable-line react/jsx-no-undef
	      , { suggestions: suggestions,
	        onSuggestionsFetchRequested: this.onSuggestionsFetchRequested,
	        onSuggestionsClearRequested: this.onSuggestionsClearRequested,
	        getSuggestionValue: getSuggestionValue,
	        renderSuggestion: renderSuggestion,
	        inputProps: inputProps
	      });
	    }
	  }]);

	  return App;
	}(React.Component);

      ReactDOM.render(
        React.createElement(App, null),
        document.getElementById('app')
      ); // eslint-disable-line no-undef

      /***/
    }
    /******/
  ]
);
