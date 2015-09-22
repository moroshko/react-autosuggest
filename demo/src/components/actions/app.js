export const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
export const SUGGESTION_SELECTED = 'SUGGESTION_SELECTED';

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
