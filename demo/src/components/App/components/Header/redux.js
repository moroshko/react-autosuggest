import fetch from 'isomorphic-fetch';

const LOAD_STARGAZERS_SUCCESS = 'LOAD_STARGAZERS_SUCCESS';

const initialState = {
  stargazers: '987'
};

export function loadStargazers() {
  return dispatch => {
    fetch('https://api.github.com/repos/moroshko/react-autosuggest')
      .then(response => response.json())
      .then(response => {
        dispatch({
          type: LOAD_STARGAZERS_SUCCESS,
          stargazers: String(response.stargazers_count)
        });
      });
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case LOAD_STARGAZERS_SUCCESS:
      return {
        ...state,
        stargazers: action.stargazers
      };

    default:
      return state;
  }
}
