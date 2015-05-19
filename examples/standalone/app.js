'use strict';

var suburbs = ['Cheltenham', 'Mill Park', 'Mordialloc', 'Nunawading'];

function getSuggestions(input, callback) {
  var regex = new RegExp('^' + input, 'i');
  var suggestions = suburbs.filter(function(suburb) {
    return regex.test(suburb);
  });

  callback(null, suggestions);
}

React.render(
  React.createElement(Autosuggest, {
    suggestions: getSuggestions,
    inputAttributes: {
      placeholder: 'Type \'m\''
    }
  }),
  document.getElementById('app')
);
