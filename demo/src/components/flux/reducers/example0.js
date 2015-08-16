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

  const { type, value } = action;

  switch (type) {
    case UPDATE_INPUT_VALUE:
      const escapedInput = escapeRegexCharacters(value.trim());
      const regex = new RegExp(escapedInput, 'i');

      return {
        value,
        suggestions: allSuggestions.filter(suggestion => regex.test(suggestion.text))
      };

    default:
      return state;
  }
}
