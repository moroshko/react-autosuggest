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
    onChange: event => dispatch(updateInputValue(exampleId, event.target.value))
  };
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
      onChange,
      onBlur: () => console.log(`Example ${exampleId}: Blurred`),
      onFocus: () => console.log(`Example ${exampleId}: Focused`)
    };

    return (
      <div>
        <Autosuggest multiSection={true}
                     suggestions={suggestions}
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
