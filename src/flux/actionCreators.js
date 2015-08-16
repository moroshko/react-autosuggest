import { UPDATE_IS_OPEN } from './constants';

export function updateIsOpen(value) {
  return {
    type: UPDATE_IS_OPEN,
    value
  };
}
