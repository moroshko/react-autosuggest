import { UPDATE_INPUT_VALUE, SUGGESTION_SELECTED } from 'flux/constants/actionTypes';

export function updateInputValue(exampleNumber, value, method) {
  return {
    type: UPDATE_INPUT_VALUE,
    exampleNumber,
    value,
    method
  };
}

export function suggestionSelected(exampleNumber, suggestionValue, suggestionId) {
  return {
    type: SUGGESTION_SELECTED,
    exampleNumber,
    suggestionValue,
    suggestionId
  };
}
