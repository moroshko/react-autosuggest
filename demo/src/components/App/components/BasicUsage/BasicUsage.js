import theme from 'theme.less';
import styles from './BasicUsage.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue, suggestionSelected } from 'BasicUsage/redux';
import Autosuggest from 'AutosuggestContainer';

function mapStateToProps({ basicUsage }) {
  const { value, suggestions } = basicUsage;

  return {
    value,
    suggestions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value, method) => {
      dispatch(updateInputValue(value, method));
    },
    onSuggestionSelected: (event, { suggestion, method }) => {
      dispatch(suggestionSelected(getSuggestionValue(suggestion)));
    }
  };
}

function getSuggestionValue(suggestion) {
  return suggestion.text;
}

function renderSuggestion(suggestion) {
  return (
    <span>{suggestion.text}</span>
  );
}

function Example(props) {
  const { value, suggestions, onChange, onSuggestionSelected } = props;
  const inputProps = {
    placeholder: 'Type a fruit',
    value,
    onChange: (event, { newValue, method }) => {
      onChange(newValue, method);
    }
  };

  return (
    <div className={styles.container}>
      <h3 id="basic-usage">Basic usage</h3>
      <div className={styles.content}>
        <ul className={styles.info}>
          <li>Plain list of suggestions</li>
        </ul>
        <Autosuggest suggestions={suggestions}
                     getSuggestionValue={getSuggestionValue}
                     renderSuggestion={renderSuggestion}
                     inputProps={inputProps}
                     onSuggestionSelected={onSuggestionSelected}
                     theme={theme} />
      </div>
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
