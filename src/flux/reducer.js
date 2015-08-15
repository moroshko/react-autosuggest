import { UPDATE_VALUE } from './constants';

export default function(state, action) {
  switch (action.type) {
    case UPDATE_VALUE:
      return {
        ...state,
        inputProps: {
          ...state.inputProps,
          value: action.value
        }
      };

    default:
      return state;
  }
}
