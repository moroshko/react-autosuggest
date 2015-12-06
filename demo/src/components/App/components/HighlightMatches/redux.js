import countries from 'data/countries';
import { escapeRegexCharacters, randomDelay } from 'utils/utils';

const UPDATE_INPUT_VALUE = 'HIGHLIGHT_MATCHES_UPDATE_INPUT_VALUE';
const SUGGESTION_SELECTED = 'HIGHLIGHT_MATCHES_SUGGESTION_SELECTED';

const initialState = {
  value: '',
  suggestions: countries
};

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp('^' + escapedValue, 'i');

  return countries.filter(country => regex.test(country.name));
}

export function updateInputValue(value, method) {
  return {
    type: UPDATE_INPUT_VALUE,
    value,
    method
  };
}

export function suggestionSelected(suggestionValue) {
  return {
    type: SUGGESTION_SELECTED,
    suggestionValue
  };
}

export default function reducer(state = initialState, action = {}) {
  const { type } = action;

  switch (type) {
    case UPDATE_INPUT_VALUE:
      const { value, method } = action;

      switch (method) {
        case 'type':
          return {
            ...state,
            value,
            suggestions: getSuggestions(value)
          };

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

    case SUGGESTION_SELECTED:
      const { suggestionValue } = action;

      return {
        ...state,
        suggestions: getSuggestions(suggestionValue)
      };

    default:
      return state;
  }
}
