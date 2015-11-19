import theme from 'theme.less';
import styles from './Example1.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue, suggestionSelected } from 'Example1/redux';
import Autosuggest from 'AutosuggestContainer';

function mapStateToProps(state) {
  const { value, suggestions, selectedSuggestionId } = state[1];

  return {
    value,
    suggestions,
    selectedSuggestionId
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value, method) => {
      dispatch(updateInputValue(value, method));
    },
    onSuggestionSelected: (event, { suggestion, method }) => {
      console.log('Example 1: Suggestion selected:', suggestion, `method = ${method}`);
      dispatch(suggestionSelected(getSuggestionValue(suggestion), suggestion.id));
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

function renderSectionTitle(section) {
  return (
    <strong>{section.title}</strong>
  );
}

function getSectionSuggestions(section) {
  return section.suggestions;
}

function Example(props) {
  const { value, suggestions, selectedSuggestionId,
          onChange, onSuggestionSelected } = props;
  const inputProps = {
    placeholder: 'Pick another fruit',
    value,
    onChange: (event, { newValue, method }) => {
      console.log(`Example 1: Changed value = ${newValue}, method = ${method}`);
      onChange(newValue, method);
    },
    onBlur: () => console.log('Example 1: Blurred'),
    onFocus: () => console.log('Example 1: Focused')
  };

  return (
    <div className={styles.container}>
      <div className={styles.selectedSuggestionIdContainer}>
        Selected suggestion id: {selectedSuggestionId}
      </div>
      <Autosuggest multiSection={true}
                   suggestions={suggestions}
                   getSuggestionValue={getSuggestionValue}
                   renderSuggestion={renderSuggestion}
                   renderSectionTitle={renderSectionTitle}
                   getSectionSuggestions={getSectionSuggestions}
                   inputProps={inputProps}
                   onSuggestionSelected={onSuggestionSelected}
                   theme={theme} />
    </div>
  );
}

Example.propTypes = {
  value: PropTypes.string.isRequired,
  suggestions: PropTypes.array.isRequired,
  selectedSuggestionId: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
