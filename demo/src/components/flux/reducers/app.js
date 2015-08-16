import { UPDATE_INPUT_VALUE } from 'flux/constants/actionTypes/app';

const reducers = [
  require('./example0'),
  require('./example1')
];

const initialState = {
  0: reducers[0](),
  1: reducers[1]()
};

export default function(state = initialState, action) {
  const { type, exampleNumber } = action;

  switch (type) {
    case UPDATE_INPUT_VALUE:
      return {
        ...state,
        [exampleNumber]: reducers[exampleNumber](state[exampleNumber], action)
      };

    default:
      return state;
  }
}
