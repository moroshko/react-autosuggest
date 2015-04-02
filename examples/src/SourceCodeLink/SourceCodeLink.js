'use strict';

require('./SourceCodeLink.less');

import React from 'react';

class SourceCodeLink extends React.Component {
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
  file: React.PropTypes.string.isRequired
};

export default SourceCodeLink;
