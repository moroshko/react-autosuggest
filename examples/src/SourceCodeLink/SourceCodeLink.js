require('./SourceCodeLink.less');

import React, { Component, PropTypes } from 'react';

export default class SourceCodeLink extends Component {
  static propTypes = {
    file: PropTypes.string.isRequired
  }

  render() {
    const { file } = this.props;
    const linkName = 'Source code - ' + file.split('/')[2];

    return (
      <a className="source-code-link"
         href={`//github.com/moroshko/react-autosuggest/tree/master/${file}`}
         target="_blank"
         data-link-name={linkName}>
        Source code
      </a>
    );
  }
}
