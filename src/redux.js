const INPUT_FOCUSED = 'INPUT_FOCUSED';
const INPUT_BLURRED = 'INPUT_BLURRED';
const INPUT_CHANGED = 'INPUT_CHANGED';
const UPDATE_FOCUSED_SUGGESTION = 'UPDATE_FOCUSED_SUGGESTION';
const REVEAL_SUGGESTIONS = 'REVEAL_SUGGESTIONS';
const CLOSE_SUGGESTIONS = 'CLOSE_SUGGESTIONS';

export function inputFocused() {
  return {
    type: INPUT_FOCUSED
  };
}

export function inputBlurred() {
  return {
    type: INPUT_BLURRED
  };
}

export function inputChanged(shouldCollapse) {
  return {
    type: INPUT_CHANGED,
    shouldCollapse
  };
}

export function updateFocusedSuggestion(sectionIndex, suggestionIndex, value) {
  return {
    type: UPDATE_FOCUSED_SUGGESTION,
    sectionIndex,
    suggestionIndex,
    value
  };
}

export function revealSuggestions() {
  return {
    type: REVEAL_SUGGESTIONS
  };
}

export function closeSuggestions() {
  return {
    type: CLOSE_SUGGESTIONS
  };
}

export default function reducer(state, action) {
  switch (action.type) {
    case INPUT_FOCUSED:
      return {
        ...state,
        isFocused: true
      };

    case INPUT_BLURRED:
      return {
        ...state,
        isFocused: false,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null
      };

    case INPUT_CHANGED:
      return {
        ...state,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: action.shouldCollapse
      };

    case UPDATE_FOCUSED_SUGGESTION: {
      const { value, sectionIndex, suggestionIndex } = action;
      const valueBeforeUpDown =
        state.valueBeforeUpDown === null && typeof value !== 'undefined'
          ? value
          : state.valueBeforeUpDown;

      return {
        ...state,
        focusedSectionIndex: sectionIndex,
        focusedSuggestionIndex: suggestionIndex,
        valueBeforeUpDown
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
        isCollapsed: true
      };

    default:
      return state;
  }
}
