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

export default function(state, action) {
  const { exampleNumber } = action;

  if (typeof state === 'undefined') {
    return initialState;
  }

  return {
    ...state,
    [exampleNumber]: reducers[exampleNumber](state[exampleNumber], action)
  };
}
