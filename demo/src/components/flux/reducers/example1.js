import { UPDATE_INPUT_VALUE } from 'flux/constants/actionTypes/app';
import { escapeRegexCharacters } from 'utils/utils';

const allSuggestions = [{
  title: 'A',
  suggestions: [{
    text: 'Apple'
  }, {
    text: 'Apricot'
  }]
}, {
  title: 'B',
  suggestions: [{
    text: 'Banana'
  }]
}, {
  title: 'C',
  suggestions: [{
    text: 'Cherry'
  }]
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
        suggestions: allSuggestions.map(section => {
          return {
            title: section.title,
            suggestions: section.suggestions.filter(suggestion => regex.test(suggestion.text))
          };
        }).filter(section => section.suggestions.length > 0)
      };

    default:
      return state;
  }
}
