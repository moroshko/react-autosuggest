import { escapeRegexCharacters } from 'utils/utils';

const UPDATE_INPUT_VALUE = 'MINIMAL_SETUP_UPDATE_INPUT_VALUE';
const SUGGESTION_SELECTED = 'MINIMAL_SETUP_SUGGESTION_SELECTED';

const allSuggestions = [{
  text: 'Apple'
}, {
  text: 'Banana'
}, {
  text: 'Cherry'
}, {
  text: 'Grapefruit'
}, {
  text: 'Lemon'
}];

const initialState = {
  value: '',
  suggestions: allSuggestions
};

function getSuggestions(value) {
  const escapedInput = escapeRegexCharacters(value.trim());
  const regex = new RegExp(escapedInput, 'i');

  return allSuggestions.filter(suggestion => regex.test(suggestion.text));
}

export function updateInputValue(value, method) {
  return {
    type: UPDATE_INPUT_VALUE,
    value,
    method
  };
}

export function suggestionSelected(suggestionValue, suggestionId) {
  return {
    type: SUGGESTION_SELECTED,
    suggestionValue,
    suggestionId
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
