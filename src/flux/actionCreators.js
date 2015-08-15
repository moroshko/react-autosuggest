import { UPDATE_VALUE } from './constants';

export function updateValue(value) {
  return {
    type: UPDATE_VALUE,
    value
  };
}
