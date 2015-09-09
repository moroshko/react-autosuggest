import theme from 'theme.less';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue, updateSuggestions, getCountries } from 'Example2/redux';
import Autosuggest from 'AutosuggestContainer';

const exampleId = '2';

function mapStateToProps(state) {
  return {
    value: state[exampleId].value,
    suggestions: state[exampleId].suggestions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value, method) => {
      dispatch(updateInputValue(exampleId, value, method));

      value = value.trim();

      if (value === '') {
        dispatch(updateSuggestions(exampleId, []));
      } else if (method === 'type') {
        dispatch(getCountries(exampleId, value));
      }
    },
    onSuggestionSelected: (event, { suggestion, method }) => {
      dispatch(getCountries(exampleId, suggestion.name));
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

class Example extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    suggestions: PropTypes.array.isRequired,

    onChange: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func.isRequired
  };

  render() {
    const { value, suggestions, onChange, onSuggestionSelected } = this.props;
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
}

export default connect(mapStateToProps, mapDispatchToProps)(Example);
