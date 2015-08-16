import { UPDATE_IS_OPEN, UPDATE_FOCUSED_SUGGESTION } from './constants';

export function updateIsOpen(isOpen) {
  return {
    type: UPDATE_IS_OPEN,
    isOpen
  };
}

export function updateFocusedSuggestion(sectionIndex, suggestionIndex) {
  return {
    type: UPDATE_FOCUSED_SUGGESTION,
    sectionIndex,
    suggestionIndex
  };
}
