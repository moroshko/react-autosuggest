import countries from 'data/countries';
import { escapeRegexCharacters, randomDelay } from 'utils/utils';

const UPDATE_INPUT_VALUE = 'CACHING_EXAMPLE_UPDATE_INPUT_VALUE';
const CLEAR_SUGGESTIONS = 'CACHING_EXAMPLE_CLEAR_SUGGESTIONS';
const MAYBE_UPDATE_SUGGESTIONS = 'CACHING_EXAMPLE_MAYBE_UPDATE_SUGGESTIONS';
const LOAD_SUGGESTIONS = 'CACHING_EXAMPLE_LOAD_SUGGESTIONS';

const initialState = {
  value: '',
  suggestions: getSuggestions(''),
  isLoading: false
};

let cache = {};

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return countries.filter(country => regex.test(country.name));
}

export function getCountries(value) {
  const cacheKey = value.trim().toLowerCase();

  return dispatch => {
    if (cache[cacheKey]) {
      dispatch(maybeUpdateSuggestions(cache[cacheKey], value));
    } else {
      dispatch(loadSuggestions());

      setTimeout(() => {
        const suggestions = getSuggestions(value);

        cache[cacheKey] = suggestions;

        dispatch(maybeUpdateSuggestions(suggestions, value));
      }, randomDelay());
    }
  };
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

function loadSuggestions() {
  return {
    type: LOAD_SUGGESTIONS
  };
}

function maybeUpdateSuggestions(suggestions, value) {
  return {
    type: MAYBE_UPDATE_SUGGESTIONS,
    suggestions,
    value
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

    case LOAD_SUGGESTIONS:
      return {
        ...state,
        isLoading: true
      };

    case MAYBE_UPDATE_SUGGESTIONS:
      // Ignore suggestions if input value changed
      if (action.value !== state.value) {
        return {
          ...state,
          isLoading: false
        };
      }

      return {
        ...state,
        suggestions: action.suggestions,
        isLoading: false
      };

    default:
      return state;
  }
}
