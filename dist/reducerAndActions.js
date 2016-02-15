'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.inputFocused = inputFocused;
exports.inputBlurred = inputBlurred;
exports.inputChanged = inputChanged;
exports.updateFocusedSuggestion = updateFocusedSuggestion;
exports.revealSuggestions = revealSuggestions;
exports.closeSuggestions = closeSuggestions;
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

function inputBlurred() {
  return {
    type: INPUT_BLURRED
  };
}

function inputChanged(shouldRenderSuggestions, lastAction) {
  return {
    type: INPUT_CHANGED,
    shouldRenderSuggestions: shouldRenderSuggestions,
    lastAction: lastAction
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

function closeSuggestions(lastAction) {
  return {
    type: CLOSE_SUGGESTIONS,
    lastAction: lastAction
  };
}

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
        isCollapsed: true
      });

    case INPUT_CHANGED:
      return _extends({}, state, {
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: !action.shouldRenderSuggestions,
        lastAction: action.lastAction
      });

    case UPDATE_FOCUSED_SUGGESTION:
      {
        var value = action.value;
        var sectionIndex = action.sectionIndex;
        var suggestionIndex = action.suggestionIndex;

        var valueBeforeUpDown = state.valueBeforeUpDown === null && typeof value !== 'undefined' ? value : state.valueBeforeUpDown;

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
        isCollapsed: true,
        lastAction: action.lastAction
      });

    default:
      return state;
  }
}