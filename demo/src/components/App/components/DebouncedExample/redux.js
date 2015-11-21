import debounce from 'lodash.debounce';
import countries from 'data/countries';
import { escapeRegexCharacters } from 'utils/utils';

const UPDATE_INPUT_VALUE = 'DEBOUNCED_EXAMPLE_UPDATE_INPUT_VALUE';
const CLEAR_SUGGESTIONS = 'DEBOUNCED_EXAMPLE_CLEAR_SUGGESTIONS';
const MAYBE_UPDATE_SUGGESTIONS = 'DEBOUNCED_EXAMPLE_MAYBE_UPDATE_SUGGESTIONS';
const LOAD_SUGGESTIONS = 'DEBOUNCED_EXAMPLE_LOAD_SUGGESTIONS';

const initialState = {
  value: '',
  suggestions: [],
  isLoading: false
};

function loadCountries(value, dispatch) {
  dispatch(loadSuggestions());

  setTimeout(() => {
    dispatch(maybeUpdateSuggestions(getSuggestions(value), value));
  }, 100 + Math.random() * 2000);
}

const debouncedLoadCountries = debounce(loadCountries, 1000);

function getSuggestions(value) {
  const escapedInput = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedInput, 'i');

  return countries.filter(country => regex.test(country.name));
}

export function getCountries(value, { debounce } = {}) {
  return dispatch => {
    if (debounce === true) {
      debouncedLoadCountries(value, dispatch);
    } else {
      loadCountries(value, dispatch);
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
