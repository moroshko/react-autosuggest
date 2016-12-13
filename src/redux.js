const INPUT_FOCUSED = 'INPUT_FOCUSED';
const INPUT_BLURRED = 'INPUT_BLURRED';
const INPUT_CHANGED = 'INPUT_CHANGED';
const UPDATE_FOCUSED_SUGGESTION = 'UPDATE_FOCUSED_SUGGESTION';
const RESET_FOCUSED_SUGGESTION = 'RESET_FOCUSED_SUGGESTION';
const REVEAL_SUGGESTIONS = 'REVEAL_SUGGESTIONS';
const CLOSE_SUGGESTIONS = 'CLOSE_SUGGESTIONS';

const inputFocused = shouldRenderSuggestions => ({
  type: INPUT_FOCUSED,
  shouldRenderSuggestions
});

const inputBlurred = shouldRenderSuggestions => ({
  type: INPUT_BLURRED,
  shouldRenderSuggestions
});

const inputChanged = shouldRenderSuggestions => ({
  type: INPUT_CHANGED,
  shouldRenderSuggestions
});

const updateFocusedSuggestion = (sectionIndex, suggestionIndex, prevValue) => ({
  type: UPDATE_FOCUSED_SUGGESTION,
  sectionIndex,
  suggestionIndex,
  prevValue
});

const resetFocusedSuggestion = (shouldResetValueBeforeUpDown = true) => ({
  type: RESET_FOCUSED_SUGGESTION,
  shouldResetValueBeforeUpDown
});

const revealSuggestions = () => ({
  type: REVEAL_SUGGESTIONS
});

const closeSuggestions = () => ({
  type: CLOSE_SUGGESTIONS
});

export const actionCreators = {
  inputFocused,
  inputBlurred,
  inputChanged,
  updateFocusedSuggestion,
  resetFocusedSuggestion,
  revealSuggestions,
  closeSuggestions
};

const reducer = (state, action) => {
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
      const { sectionIndex, suggestionIndex, prevValue } = action;
      let { valueBeforeUpDown } = state;

      if (suggestionIndex === null) {
        valueBeforeUpDown = null;
      } else if (valueBeforeUpDown === null && typeof prevValue !== 'undefined') {
        valueBeforeUpDown = prevValue;
      }

      return {
        ...state,
        focusedSectionIndex: sectionIndex,
        focusedSuggestionIndex: suggestionIndex,
        valueBeforeUpDown
      };
    }

    case RESET_FOCUSED_SUGGESTION: {
      return {
        ...state,
        focusedSectionIndex: null,
        focusedSuggestionIndex: null,
        valueBeforeUpDown: action.shouldResetValueBeforeUpDown ? null : state.valueBeforeUpDown
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
};

export default reducer;
