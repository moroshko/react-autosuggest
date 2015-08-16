import { UPDATE_IS_OPEN } from './constants';

export default function(state, action) {
  switch (action.type) {
    case UPDATE_IS_OPEN:
      return {
        ...state,
        isOpen: action.value
      };

    default:
      return state;
  }
}
