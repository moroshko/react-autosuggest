'use strict';

require('./Footer.less');

import React, { Component } from 'react';

export default class Footer extends Component {
  render() {
    return (
      <div className="footer">
        <img src="https://gravatar.com/avatar/e56de06f4b56f6f06e4a9a271ed57e26?s=32"
             alt="Misha Moroshko" />
        <span>
          Crafted with <strong>love</strong> by
          {' '}<a href="https://twitter.com/moroshko"
                  target="_blank">@moroshko</a>
          {' '}and <a href="https://github.com/moroshko/react-autosuggest/graphs/contributors"
                      target="_blank">contributors</a>
        </span>
      </div>
    );
  }
}
