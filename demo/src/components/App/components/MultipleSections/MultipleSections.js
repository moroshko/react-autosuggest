import theme from 'theme.less';
import styles from './MultipleSections.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue, suggestionSelected } from 'MultipleSections/redux';
import Autosuggest from 'AutosuggestContainer';

function mapStateToProps({ multipleSections }) {
  const { value, suggestions, selectedSuggestionId } = multipleSections;

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
    onSuggestionSelected: (event, { suggestion, suggestionValue }) => {
      dispatch(suggestionSelected(suggestionValue, suggestion.id));
    }
  };
}

function shouldRenderSuggestions(value) {
  return true;
}

function getSuggestionValue(suggestion) {
  return suggestion.text;
}

function renderSuggestion(suggestion) {
  return (
    <span>
      {suggestion.text}
    </span>
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
    placeholder: 'Type a fruit',
    value,
    onChange: (event, { newValue, method }) => {
      onChange(newValue, method);
    }
  };

  return (
    <div className={styles.container}>
      <h3 id="multiple-sections">Multiple sections</h3>
      <div className={styles.content}>
        <ul className={styles.info}>
          <li>Multi section list of suggestions</li>
          <li>Show suggestions when input is empty</li>
          <li>Track selected suggestion id: {selectedSuggestionId || '(none)'}</li>
        </ul>
        <Autosuggest multiSection={true}
                     shouldRenderSuggestions={shouldRenderSuggestions}
                     suggestions={suggestions}
                     getSuggestionValue={getSuggestionValue}
                     renderSuggestion={renderSuggestion}
                     renderSectionTitle={renderSectionTitle}
                     getSectionSuggestions={getSectionSuggestions}
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
  selectedSuggestionId: PropTypes.string.isRequired,

  onChange: PropTypes.func.isRequired,
  onSuggestionSelected: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Example);
