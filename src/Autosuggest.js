import React, { Component, PropTypes } from 'react';
import { updateIsOpen } from './flux/actionCreators';
import { connect } from 'react-redux';
import Autowhatever from 'react-autowhatever';

function mapStateToProps(state) {
  return {
    isOpen: state.isOpen,
    focusedSectionIndex: state.focusedSectionIndex,
    focusedSuggestionIndex: state.focusedSuggestionIndex
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateIsOpen: isOpen => dispatch(updateIsOpen(isOpen))
  };
}

class Autosuggest extends Component {
  static propTypes = {
    shouldRenderSuggestions: PropTypes.func.isRequired,
    suggestions: PropTypes.array.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,

    isOpen: PropTypes.bool.isRequired,
    focusedSectionIndex: PropTypes.number,
    focusedSuggestionIndex: PropTypes.number,

    updateIsOpen: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.shouldRenderSuggestions === this.props.shouldRenderSuggestions &&
        nextProps.suggestions === this.props.suggestions &&
        nextProps.renderSuggestion === this.props.renderSuggestion &&
        nextProps.inputProps === this.props.inputProps &&
        nextProps.theme === this.props.theme) {
      return;
    }

    const { shouldRenderSuggestions, suggestions, inputProps, updateIsOpen } = nextProps;
    const isOpen = shouldRenderSuggestions(inputProps.value) && suggestions.length > 0;

    updateIsOpen(isOpen);
  }

  render() {
    const { shouldRenderSuggestions, suggestions, renderSuggestion, inputProps, theme,
            isOpen, focusedSectionIndex, focusedSuggestionIndex, updateIsOpen } = this.props;
    const { value, onBlur, onFocus } = inputProps;
    const autowhateverInputProps = {
      ...inputProps,
      onBlur: event => {
        updateIsOpen(false);
        onBlur && onBlur(event);
      },
      onFocus: event => {
        const isOpen = shouldRenderSuggestions(value) && suggestions.length > 0;

        updateIsOpen(isOpen);
        onFocus && onFocus(event);
      },
      onKeyDown: event => {
        console.log(typeof event.key, event.key);
      }
    };

    return (
      <Autowhatever items={isOpen ? suggestions : []}
                    renderItem={renderSuggestion}
                    focusedSectionIndex={focusedSectionIndex}
                    focusedItemIndex={focusedSuggestionIndex}
                    inputProps={autowhateverInputProps}
                    theme={theme} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Autosuggest);
