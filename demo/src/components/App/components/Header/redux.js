import fetch from 'isomorphic-fetch';

const UPDATE_STARGAZERS = 'UPDATE_STARGAZERS';

const initialState = {
  stargazers: '1261'
};

export function loadStargazers() {
  return dispatch => {
    fetch('https://api.github.com/repos/moroshko/react-autosuggest')
      .then(response => response.json())
      .then(response => {
        if (response.stargazers_count) {
          dispatch({
            type: UPDATE_STARGAZERS,
            stargazers: String(response.stargazers_count)
          });
        }
      });
  };
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case UPDATE_STARGAZERS:
      return {
        ...state,
        stargazers: action.stargazers
      };

    default:
      return state;
  }
}
