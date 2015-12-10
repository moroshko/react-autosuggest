import { escapeRegexCharacters } from 'utils/utils';

const UPDATE_INPUT_VALUE = 'MULTIPLE_SECTIONS_UPDATE_INPUT_VALUE';
const SUGGESTION_SELECTED = 'MULTIPLE_SECTIONS_SUGGESTION_SELECTED';

const allSuggestions = [{
  title: 'A',
  suggestions: [{
    id: '100',
    text: 'Apple'
  }, {
    id: '101',
    text: 'Apricot'
  }]
}, {
  title: 'B',
  suggestions: [{
    id: '102',
    text: 'Banana'
  }]
}, {
  title: 'C',
  suggestions: [{
    id: '103',
    text: 'Cherry'
  }]
}];

const initialState = {
  value: '',
  suggestions: getSuggestions(''),
  selectedSuggestionId: ''
};

function getSuggestions(value) {
  const escapedValue = escapeRegexCharacters(value.trim());
  const regex = new RegExp(escapedValue, 'i');

  return allSuggestions.map(section => {
    return {
      title: section.title,
      suggestions: section.suggestions.filter(suggestion => regex.test(suggestion.text))
    };
  }).filter(section => section.suggestions.length > 0);
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
            suggestions: getSuggestions(value),
            selectedSuggestionId: ''
          };

        case 'down':
        case 'up':
        case 'click':
          return {
            ...state,
            value
          };

        case 'escape':
          return {
            ...state,
            value,
            selectedSuggestionId: ''
          };

        default:
          return state;
      }

    case SUGGESTION_SELECTED:
      const { suggestionValue, suggestionId } = action;

      return {
        ...state,
        suggestions: getSuggestions(suggestionValue),
        selectedSuggestionId: suggestionId
      };

    default:
      return state;
  }
}
