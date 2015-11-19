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
  const regex = new RegExp('^' + escapedInput, 'i');

  return countries.filter(country => regex.test(country.name));
}

export function updateInputValue(exampleNumber, value, method) {
  return {
    type: UPDATE_INPUT_VALUE,
    exampleNumber,
    value,
    method
  };
}

export function updateSuggestions(exampleNumber, suggestions) {
  return {
    type: UPDATE_SUGGESTIONS,
    exampleNumber,
    suggestions
  };
}

export function getCountries(exampleNumber, value) {
  return dispatch => {
    setTimeout(() => {
      dispatch(updateSuggestions(exampleNumber, getSuggestions(value)));
    }, 100);
  };
}

export default function reducer(state = initialState, action = {}) {
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
      return {
        ...state,
        suggestions: action.suggestions
      };

    default:
      return state;
  }
}
