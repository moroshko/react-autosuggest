import countries from './countries';
import { escapeRegexCharacters } from 'utils/utils';

const UPDATE_INPUT_VALUE = 'EXAMPLE2_UPDATE_INPUT_VALUE';
const CLEAR_SUGGESTIONS = 'EXAMPLE2_CLEAR_SUGGESTIONS';
const MAYBE_UPDATE_SUGGESTIONS = 'EXAMPLE2_MAYBE_UPDATE_SUGGESTIONS';

const initialState = {
  value: '',
  suggestions: []
};

function getSuggestions(value) {
  const escapedInput = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedInput, 'i');

  return countries.filter(country => regex.test(country.name));
}

export function updateInputValue(value, method) {
  return {
    type: UPDATE_INPUT_VALUE,
    value,
    method
  };
}

export function clearSuggestions() {
  return {
    type: CLEAR_SUGGESTIONS
  };
}

export function maybeUpdateSuggestions(suggestions, value) {
  return {
    type: MAYBE_UPDATE_SUGGESTIONS,
    suggestions,
    value
  };
}

export function getCountries(value) {
  return dispatch => {
    setTimeout(() => {
      const suggestions = getSuggestions(value);

      console.log(`Example 2: Set ${suggestions.length} suggestion${suggestions.length === 1 ? '' : 's'}`);

      dispatch(maybeUpdateSuggestions(suggestions, value));
    }, Math.random() * 1000);
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

    case CLEAR_SUGGESTIONS:
      return {
        ...state,
        suggestions: []
      };

    case MAYBE_UPDATE_SUGGESTIONS:
      // Ignore suggestions if input value changed
      if (action.value !== state.value) {
        return state;
      }

      return {
        ...state,
        suggestions: action.suggestions
      };

    default:
      return state;
  }
}
