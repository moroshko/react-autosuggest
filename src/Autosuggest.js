import React, { Component, PropTypes } from 'react';
import { updateValue } from './flux/actionCreators';
import { connect } from 'react-redux';
import Autowhatever from 'react-autowhatever';

function mapStateToProps(state) {
  return {
    items: state.items,
    renderItem: state.renderItem,
    inputProps: state.inputProps,
    theme: state.theme
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onChange: event => dispatch(updateValue(event.target.value))
  };
}

class Autosuggest extends Component {
  static propTypes = {
    items: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    inputProps: PropTypes.object.isRequired,
    theme: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired
  };

  render() {
    const { items, renderItem, theme, onChange } = this.props;
    const inputProps = {
      ...this.props.inputProps,
      onChange
    };

    return (
      <Autowhatever items={items}
                    renderItem={renderItem}
                    inputProps={inputProps}
                    theme={theme} />
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Autosuggest);
