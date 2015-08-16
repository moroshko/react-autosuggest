import React, { Component, PropTypes } from 'react';
import { updateIsOpen } from './flux/actionCreators';
import { connect } from 'react-redux';
import Autowhatever from 'react-autowhatever';
import sectionIterator from 'section-iterator';

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
    multiSection: PropTypes.bool.isRequired,
    shouldRenderSuggestions: PropTypes.func.isRequired,
    suggestions: PropTypes.array.isRequired,
    renderSuggestion: PropTypes.func.isRequired,
    renderSectionTitle: PropTypes.func.isRequired,
    getSectionSuggestions: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,

    isOpen: PropTypes.bool.isRequired,
    focusedSectionIndex: PropTypes.number,
    focusedSuggestionIndex: PropTypes.number,

    updateIsOpen: PropTypes.func.isRequired
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.multiSection === this.props.multiSection &&
        nextProps.shouldRenderSuggestions === this.props.shouldRenderSuggestions &&
        nextProps.suggestions === this.props.suggestions &&
        nextProps.renderSuggestion === this.props.renderSuggestion &&
        nextProps.renderSectionTitle === this.props.renderSectionTitle &&
        nextProps.getSectionSuggestions === this.props.getSectionSuggestions &&
        nextProps.inputProps === this.props.inputProps &&
        nextProps.theme === this.props.theme) {
      return;
    }

    const { shouldRenderSuggestions, suggestions, inputProps, updateIsOpen } = nextProps;
    const isOpen = shouldRenderSuggestions(inputProps.value) && suggestions.length > 0;

    updateIsOpen(isOpen);
  }

  render() {
    const { multiSection, shouldRenderSuggestions, suggestions,
            renderSuggestion, renderSectionTitle, getSectionSuggestions,
            inputProps, theme, isOpen, focusedSectionIndex,
            focusedSuggestionIndex, updateIsOpen } = this.props;
    const items = (isOpen ? suggestions : []);
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
      <Autowhatever multiSection={multiSection}
                    items={items}
                    renderItem={renderSuggestion}
                    renderSectionTitle={renderSectionTitle}
                    getSectionItems={getSectionSuggestions}
                    focusedSectionIndex={focusedSectionIndex}
                    focusedItemIndex={focusedSuggestionIndex}
                    inputProps={autowhateverInputProps}
                    theme={theme} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Autosuggest);
