import fetch from 'isomorphic-fetch';

const UPDATE_STARGAZERS = 'UPDATE_STARGAZERS';

const initialState = {
  stargazers: '1419'
};

export const loadStargazers = () => dispatch =>
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

const reducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case UPDATE_STARGAZERS:
      return {
        ...state,
        stargazers: action.stargazers
      };

    default:
      return state;
  }
};

export default reducer;
