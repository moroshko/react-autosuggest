const INPUT_FOCUSED = 'INPUT_FOCUSED';
const INPUT_BLURRED = 'INPUT_BLURRED';
const INPUT_CHANGED = 'INPUT_CHANGED';
const UPDATE_FOCUSED_SUGGESTION = 'UPDATE_FOCUSED_SUGGESTION';
const UPDATE_FOCUSED_USING_KEYBOARD = 'UPDATE_FOCUSED_USING_KEYBOARD';
const REVEAL_SUGGESTIONS = 'REVEAL_SUGGESTIONS';
const CLOSE_SUGGESTIONS = 'CLOSE_SUGGESTIONS';

export function inputFocused(shouldRenderSuggestions) {
  return {
    type: INPUT_FOCUSED,
    shouldRenderSuggestions
  };
}

export function inputBlurred() {
  return {
    type: INPUT_BLURRED
  };
}

export function inputChanged(shouldRenderSuggestions, lastAction) {
  return {
    type: INPUT_CHANGED,
    shouldRenderSuggestions,
    lastAction
  };
}

export function updateFocusedSuggestion(sectionIndex, suggestionIndex, value, isKeyboard) {
  return {
    type: UPDATE_FOCUSED_SUGGESTION,
    sectionIndex,
    suggestionIndex,
    value,
    isKeyboard
  };
}

export function updateFocusedUsingKeyboard(isKeyboard) {
  return {
    type: UPDATE_FOCUSED_USING_KEYBOARD,
    isKeyboard
  };
}

export function revealSuggestions() {
  return {
    type: REVEAL_SUGGESTIONS
  };
}

export function closeSuggestions(lastAction) {
  return {
    type: CLOSE_SUGGESTIONS,
    lastAction
  };
}

export default function reducer(state, action) {
  switch (action.type) {
    case INPUT_FOCUSED:
      return {
        ...state,
        isFocused: true,
        isCollapsed: !action.shouldRenderSuggestions
      };

    case INPUT_BLURRED:
      return {
        ...state,
        isFocused: false,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: true
      };

    case INPUT_CHANGED:
      return {
        ...state,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: !action.shouldRenderSuggestions,
        lastAction: action.lastAction
      };

    case UPDATE_FOCUSED_SUGGESTION: {
      const { value, sectionIndex, suggestionIndex, isKeyboard } = action;
      const valueBeforeUpDown =
        state.valueBeforeUpDown === null && typeof value !== 'undefined'
          ? value
          : state.valueBeforeUpDown;

      return {
        ...state,
        focusedSectionIndex: sectionIndex,
        focusedSuggestionIndex: suggestionIndex,
        valueBeforeUpDown,
        focusedUsingKeyboard: isKeyboard
      };
    }

    case UPDATE_FOCUSED_USING_KEYBOARD: {
      const { isKeyboard } = action;

      return {
        ...state,
        focusedUsingKeyboard: isKeyboard
      };
    }

    case REVEAL_SUGGESTIONS:
      return {
        ...state,
        isCollapsed: false
      };

    case CLOSE_SUGGESTIONS:
      return {
        ...state,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: true,
        lastAction: action.lastAction
      };

    default:
      return state;
  }
}
