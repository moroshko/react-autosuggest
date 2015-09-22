import { UPDATE_INPUT_VALUE, SUGGESTION_SELECTED } from 'actions/app';
import { escapeRegexCharacters } from 'utils/utils';

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

export default function(state = initialState, action) {
  if (!action) {
    return state;
  }

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
