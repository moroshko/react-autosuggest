import { UPDATE_INPUT_VALUE } from 'flux/constants/actionTypes/app';

const initialState = {
  0: {
    value: 'Hello'
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_INPUT_VALUE:
      return {
        ...state,
        [action.exampleNumber]: {
          value: action.value
        }
      };

    default:
      return state;
  }
}
