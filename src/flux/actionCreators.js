import { INPUT_FOCUSED, INPUT_BLURRED, UPDATE_FOCUSED_SUGGESTION } from './constants';

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

export function updateFocusedSuggestion(sectionIndex, suggestionIndex) {
  return {
    type: UPDATE_FOCUSED_SUGGESTION,
    sectionIndex,
    suggestionIndex
  };
}
