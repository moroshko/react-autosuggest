import theme from 'theme.less';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue, updateSuggestions, getCountries } from 'Example2/redux';
import Autosuggest from 'AutosuggestContainer';

function mapStateToProps(state) {
  const { value, suggestions } = state[2];

  return {
    value,
    suggestions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value, method) => {
      dispatch(updateInputValue(value, method));

      value = value.trim();

      if (value === '') {
        dispatch(updateSuggestions([]));
      } else if (method === 'type') {
        dispatch(getCountries(value));
      }
    },
    onSuggestionSelected: (event, { suggestion, method }) => {
      dispatch(getCountries(suggestion.name));
    }
  };
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.name}</span>
  );
}

function Example(props) {
  const { value, suggestions, onChange, onSuggestionSelected } = props;
  const inputProps = {
    placeholder: 'Pick a country',
    value,
    onChange: (event, { newValue, method }) => {
      onChange(newValue, method);
    }
  };

  return (
    <div>
      <Autosuggest suggestions={suggestions}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   inputProps={inputProps}
                   onSuggestionSelected={onSuggestionSelected}
                   theme={theme} />
    </div>
  );
}

Example.propTypes = {
  value: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,

  onChange: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
