import theme from 'theme.less';
import styles from './HighlightMatches.less';

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue, suggestionSelected } from 'HighlightMatches/redux';
import Autosuggest from 'AutosuggestContainer';
import highlight  from 'autosuggest-highlight';

function mapStateToProps({ highlightMatches }) {
  const { value, suggestions } = highlightMatches;

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
    onSuggestionSelected: (event, { suggestionValue }) => {
      dispatch(suggestionSelected(suggestionValue));
    }
  };
}

function getSuggestionValue(suggestion) {
  return suggestion.name;
}

function renderSuggestion(suggestion, value, valueBeforeUpDown) {
  const query = (valueBeforeUpDown || value).trim();
  const matches = highlight.match(suggestion.name, query);
  const parts = highlight.parse(suggestion.name, matches);

  return parts.map((part, index) => {
    const className = part.highlight ? styles.highlight : null;

    return (
      <span className={className} key={index}>{part.text}</span>
    );
  });
}

function Example(props) {
  const { value, suggestions, onChange, onSuggestionSelected } = props;
  const inputProps = {
    placeholder: 'Type a country',
    value,
    onChange: (event, { newValue, method }) => {
      onChange(newValue, method);
    }
  };

  return (
    <div className={styles.container}>
      <h3 id="highlight-matches">Highlight matches</h3>
      <div className={styles.content}>
        <ul className={styles.info}>
          <li>Highlight the match</li>
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
