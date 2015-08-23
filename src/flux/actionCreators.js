import { INPUT_FOCUSED, INPUT_BLURRED, INPUT_CHANGED, UPDATE_FOCUSED_SUGGESTION,
         REVEAL_SUGGESTIONS, CLOSE_SUGGESTIONS } from './constants';

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
