'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.default = reducer;
var INPUT_FOCUSED = 'INPUT_FOCUSED';
var INPUT_BLURRED = 'INPUT_BLURRED';
var INPUT_CHANGED = 'INPUT_CHANGED';
var UPDATE_FOCUSED_SUGGESTION = 'UPDATE_FOCUSED_SUGGESTION';
var REVEAL_SUGGESTIONS = 'REVEAL_SUGGESTIONS';
var CLOSE_SUGGESTIONS = 'CLOSE_SUGGESTIONS';

function inputFocused(shouldRenderSuggestions) {
  return {
    type: INPUT_FOCUSED,
    shouldRenderSuggestions: shouldRenderSuggestions
  };
}

function inputBlurred(shouldRenderSuggestions) {
  return {
    type: INPUT_BLURRED,
    shouldRenderSuggestions: shouldRenderSuggestions
  };
}

function inputChanged(shouldRenderSuggestions) {
  return {
    type: INPUT_CHANGED,
    shouldRenderSuggestions: shouldRenderSuggestions
  };
}

function updateFocusedSuggestion(sectionIndex, suggestionIndex, value) {
  return {
    type: UPDATE_FOCUSED_SUGGESTION,
    sectionIndex: sectionIndex,
    suggestionIndex: suggestionIndex,
    value: value
  };
}

function revealSuggestions() {
  return {
    type: REVEAL_SUGGESTIONS
  };
}

function closeSuggestions() {
  return {
    type: CLOSE_SUGGESTIONS
  };
}

var actionCreators = exports.actionCreators = {
  inputFocused: inputFocused,
  inputBlurred: inputBlurred,
  inputChanged: inputChanged,
  updateFocusedSuggestion: updateFocusedSuggestion,
  revealSuggestions: revealSuggestions,
  closeSuggestions: closeSuggestions
};

function reducer(state, action) {
  switch (action.type) {
    case INPUT_FOCUSED:
      return _extends({}, state, {
        isFocused: true,
        isCollapsed: !action.shouldRenderSuggestions
      });

    case INPUT_BLURRED:
      return _extends({}, state, {
        isFocused: false,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: !action.shouldRenderSuggestions
      });

    case INPUT_CHANGED:
      return _extends({}, state, {
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: !action.shouldRenderSuggestions
      });

    case UPDATE_FOCUSED_SUGGESTION:
      {
        var value = action.value;
        var sectionIndex = action.sectionIndex;
        var suggestionIndex = action.suggestionIndex;
        var valueBeforeUpDown = state.valueBeforeUpDown;


        if (suggestionIndex === null) {
          valueBeforeUpDown = null;
        } else if (valueBeforeUpDown === null && typeof value !== 'undefined') {
          valueBeforeUpDown = value;
        }

        return _extends({}, state, {
          focusedSectionIndex: sectionIndex,
          focusedSuggestionIndex: suggestionIndex,
          valueBeforeUpDown: valueBeforeUpDown
        });
      }

    case REVEAL_SUGGESTIONS:
      return _extends({}, state, {
        isCollapsed: false
      });

    case CLOSE_SUGGESTIONS:
      return _extends({}, state, {
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: true
      });

    default:
      return state;
  }
}