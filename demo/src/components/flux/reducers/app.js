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
  0: {
    value: '',
    suggestions: allSuggestions
  }
};

export default function(state = initialState, action) {
  switch (action.type) {
    case UPDATE_INPUT_VALUE:
      const escapedInput = escapeRegexCharacters(action.value.trim());
      const regex = new RegExp(escapedInput, 'i');

      return {
        ...state,
        [action.exampleNumber]: {
          value: action.value,
          suggestions: allSuggestions.filter(suggestion => regex.test(suggestion.text))
        }
      };

    default:
      return state;
  }
}
