const INPUT_FOCUSED = 'INPUT_FOCUSED';
const INPUT_BLURRED = 'INPUT_BLURRED';
const INPUT_CHANGED = 'INPUT_CHANGED';
const UPDATE_FOCUSED_SUGGESTION = 'UPDATE_FOCUSED_SUGGESTION';
const REVEAL_SUGGESTIONS = 'REVEAL_SUGGESTIONS';
const CLOSE_SUGGESTIONS = 'CLOSE_SUGGESTIONS';

function inputFocused(shouldRenderSuggestions) {
  return {
    type: INPUT_FOCUSED,
    shouldRenderSuggestions
  };
}

function inputBlurred(shouldRenderSuggestions) {
  return {
    type: INPUT_BLURRED,
    shouldRenderSuggestions
  };
}

function inputChanged(shouldRenderSuggestions) {
  return {
    type: INPUT_CHANGED,
    shouldRenderSuggestions
  };
}

function updateFocusedSuggestion(sectionIndex, suggestionIndex, value) {
  return {
    type: UPDATE_FOCUSED_SUGGESTION,
    sectionIndex,
    suggestionIndex,
    value
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

export const actionCreators = {
  inputFocused,
  inputBlurred,
  inputChanged,
  updateFocusedSuggestion,
  revealSuggestions,
  closeSuggestions
};

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
        isCollapsed: !action.shouldRenderSuggestions
      };

    case INPUT_CHANGED:
      return {
        ...state,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: null,
        isCollapsed: !action.shouldRenderSuggestions
      };

    case UPDATE_FOCUSED_SUGGESTION: {
      const { value, sectionIndex, suggestionIndex } = action;
      let { valueBeforeUpDown } = state;

      if (suggestionIndex === null) {
        valueBeforeUpDown = null;
      } else if (valueBeforeUpDown === null && typeof value !== 'undefined') {
        valueBeforeUpDown = value;
      }

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
