import { INPUT_FOCUSED, INPUT_BLURRED, UPDATE_FOCUSED_SUGGESTION } from './constants';

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

    case UPDATE_FOCUSED_SUGGESTION:
      return {
        ...state,
        focusedSectionIndex: action.sectionIndex,
        focusedSuggestionIndex: action.suggestionIndex
      };

    default:
      return state;
  }
}
