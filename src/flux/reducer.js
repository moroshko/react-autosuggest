import { UPDATE_IS_OPEN, UPDATE_FOCUSED_SUGGESTION } from './constants';

export default function(state, action) {
  switch (action.type) {
    case UPDATE_IS_OPEN:
      return {
        ...state,
        isOpen: action.isOpen
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
