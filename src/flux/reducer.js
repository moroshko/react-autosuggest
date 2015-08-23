import { INPUT_FOCUSED, INPUT_BLURRED, INPUT_CHANGED,
         UPDATE_FOCUSED_SUGGESTION } from './constants';

export default function(state, action) {
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
        valueBeforeUpDown: null
      };

    case UPDATE_FOCUSED_SUGGESTION: {
      const valueBeforeUpDown =
        state.valueBeforeUpDown === null ? action.value : state.valueBeforeUpDown;

      return {
        ...state,
        focusedSectionIndex: action.sectionIndex,
        focusedSuggestionIndex: action.suggestionIndex,
        valueBeforeUpDown
      };
    }

    default:
      return state;
  }
}
