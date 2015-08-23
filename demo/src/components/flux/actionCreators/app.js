import { UPDATE_INPUT_VALUE, SUGGESTION_SELECTED } from 'flux/constants/actionTypes';

export function updateInputValue(exampleNumber, value, reason) {
  return {
    type: UPDATE_INPUT_VALUE,
    exampleNumber,
    value,
    reason
  };
}

export function suggestionSelected(exampleNumber, suggestionValue) {
  return {
    type: SUGGESTION_SELECTED,
    exampleNumber,
    suggestionValue
  };
}
