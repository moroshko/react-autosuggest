import { UPDATE_INPUT_VALUE } from 'flux/constants/actionTypes/app';

export function updateInputValue(exampleNumber, value) {
  return {
    type: UPDATE_INPUT_VALUE,
    exampleNumber,
    value
  };
}
