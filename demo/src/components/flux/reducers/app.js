import { UPDATE_INPUT_VALUE, SUGGESTION_SELECTED } from 'flux/constants/actionTypes';
import reducer2 from 'App/components/Example2/redux';

const reducers = [
  require('./example0'),
  require('./example1'),
  reducer2
];

const initialState = {
  0: reducers[0](),
  1: reducers[1](),
  2: reducers[2]()
};

export default function(state = initialState, action) {
  const { type, exampleNumber } = action;

  switch (type) {
    case UPDATE_INPUT_VALUE:
      return {
        ...state,
        [exampleNumber]: reducers[exampleNumber](state[exampleNumber], action)
      };

    case SUGGESTION_SELECTED:
      return {
        ...state,
        [exampleNumber]: reducers[exampleNumber](state[exampleNumber], action)
      };

    default:
      return state;
  }
}
