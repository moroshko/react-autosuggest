'use strict';

require('./SourceCodeLink.less');

import React, { Component, PropTypes } from 'react';

export default class SourceCodeLink extends Component {
  render() {
    return (
      <a className="source-code-link"
         href={'//github.com/moroshko/react-autosuggest/tree/master/' + this.props.file}
         target="_blank">
        Source code
      </a>
    );
  }
}

SourceCodeLink.propTypes = {
  file: PropTypes.string.isRequired
};
