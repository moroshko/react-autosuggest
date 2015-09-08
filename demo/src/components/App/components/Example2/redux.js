import groupby from 'lodash.groupby';
import countries from './countries';
import { escapeRegexCharacters } from 'utils/utils';

const UPDATE_INPUT_VALUE = 'UPDATE_INPUT_VALUE';
const UPDATE_SUGGESTIONS = 'UPDATE_SUGGESTIONS';

const initialState = {
  value: '',
  suggestions: []
};

function getSuggestions(value) {
  const escapedInput = escapeRegexCharacters(value.trim());
  const regex = new RegExp(escapedInput, 'i');
  const matchedCountries = countries.filter(country => regex.test(country.name));

  return groupby(matchedCountries, country => {
    return country.name.charAt(0).toUpperCase();
  });
}

export function updateInputValue(exampleNumber, value, method) {
  return {
    type: UPDATE_INPUT_VALUE,
    exampleNumber,
    value,
    method
  };
}

export function getCountries(value) {
  return dispatch => {
    setTimeout(() => {
      console.log(getSuggestions(value));
      dispatch({
        type: UPDATE_SUGGESTIONS,
        suggestions: getSuggestions(value)
      });
    }, 300);
  };
}

export default function reducer(state = initialState, action) {
  if (!action) {
    return state;
  }

  const { type } = action;

  switch (type) {
    case UPDATE_INPUT_VALUE:
      const { value, method } = action;

      switch (method) {
        case 'type':
        case 'down':
        case 'up':
        case 'escape':
        case 'click':
          return {
            ...state,
            value
          };

        default:
          return state;
      }

    case UPDATE_SUGGESTIONS:
      console.log(action.suggestions);

      return state;

    default:
      return state;
  }
}
