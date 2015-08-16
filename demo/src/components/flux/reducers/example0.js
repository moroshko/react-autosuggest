import { UPDATE_INPUT_VALUE } from 'flux/constants/actionTypes/app';
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

export default function(state = initialState, action) {
  if (!action) {
    return state;
  }

  const { type, value, reason } = action;

  switch (type) {
    case UPDATE_INPUT_VALUE:
      switch (reason) {
        case 'type':
          const escapedInput = escapeRegexCharacters(value.trim());
          const regex = new RegExp(escapedInput, 'i');

          return {
            ...state,
            value,
            suggestions: allSuggestions.filter(suggestion => regex.test(suggestion.text))
          };

        case 'up-down':
          return {
            ...state,
            value
          };

        default:
          return state;
      }

    default:
      return state;
  }
}
