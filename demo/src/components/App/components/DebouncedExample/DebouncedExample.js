import theme from 'theme.less';
import styles from './DebouncedExample.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue, clearSuggestions, getCountries } from 'DebouncedExample/redux';
import Autosuggest from 'AutosuggestContainer';

function mapStateToProps({ debouncedExample }) {
  const { value, suggestions, isLoading } = debouncedExample;

  return {
    value,
    suggestions,
    isLoading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value, method) => {
      dispatch(updateInputValue(value, method));

      value = value.trim();

      if (value === '') {
        dispatch(clearSuggestions());
      } else if (method === 'type') {
        dispatch(getCountries(value, { debounce: true }));
      }
    },
    onSuggestionSelected: (event, { suggestionValue }) => {
      dispatch(getCountries(suggestionValue));
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
  const { value, suggestions, onChange, onSuggestionSelected, isLoading } = props;
  const inputProps = {
    placeholder: 'Type a country',
    value,
    onChange: (event, { newValue, method }) => {
      onChange(newValue, method);
    }
  };
  const status = (isLoading ? 'Loading...' : 'Type to load suggestions');

  return (
    <div className={styles.container}>
      <h3 id="debounced-example">Debounced example</h3>
      <div className={styles.content}>
        <ul className={styles.info}>
          <li>
            Retrieve suggestions asynchronously with 200ms debounce<br />
            Status: {status}
          </li>
        </ul>
        <Autosuggest suggestions={suggestions}
                     getSuggestionValue={getSuggestionValue}
                     renderSuggestion={renderSuggestion}
                     inputProps={inputProps}
                     onSuggestionSelected={onSuggestionSelected}
                     theme={theme}
                     id="debounced-example" />
      </div>
    </div>
  );
}

Example.propTypes = {
  value: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
  isLoading: PropTypes.bool.isRequired,

  onChange: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
