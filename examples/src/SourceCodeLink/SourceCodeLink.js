'use strict';

require('./SourceCodeLink.less');

import React, { Component, PropTypes } from 'react';

export default class SourceCodeLink extends Component { // eslint-disable-line no-shadow
  static propTypes = {
    file: PropTypes.string.isRequired
  }

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
