import theme from 'theme.less';

import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { updateInputValue } from 'flux/actionCreators/app';
import Autosuggest from 'AutosuggestContainer';

const exampleId = '1';

function mapStateToProps(state) {
  return {
    value: state[exampleId].value,
    suggestions: state[exampleId].suggestions
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: (value, reason) => dispatch(updateInputValue(exampleId, value, reason))
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

class Example extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    suggestions: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { value, suggestions, onChange } = this.props;
    const inputProps = {
      placeholder: 'Pick another fruit',
      value,
      onChange: (event, value, reason) => {
        console.log(`Example ${exampleId}: Changed value = ${value}, reason = ${reason}`);
        onChange(value, reason);
      },
      onBlur: () => console.log(`Example ${exampleId}: Blurred`),
      onFocus: () => console.log(`Example ${exampleId}: Focused`),
      onKeyDown: event => console.log(`Example ${exampleId}: keyCode = ${event.keyCode}`)
    };

    return (
      <div>
        <Autosuggest multiSection={true}
                     suggestions={suggestions}
                     getSuggestionValue={getSuggestionValue}
                     renderSuggestion={renderSuggestion}
                     renderSectionTitle={renderSectionTitle}
                     getSectionSuggestions={getSectionSuggestions}
                     inputProps={inputProps}
                     theme={theme} />
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Example);
