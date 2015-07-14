require('./Footer.less');

import React, { Component } from 'react';

export default class Footer extends Component { // eslint-disable-line no-shadow
  render() {
    return (
      <div className="footer">
        <img src="//gravatar.com/avatar/e56de06f4b56f6f06e4a9a271ed57e26?s=32"
             alt="Misha Moroshko" />
        <span>
          Crafted with <strong>love</strong> by <a href="//twitter.com/moroshko" target="_blank">@moroshko</a>
        </span>
      </div>
    );
  }
}
