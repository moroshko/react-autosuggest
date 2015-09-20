require('./Badges.less');

import React, { Component } from 'react';

export default class Badges extends Component {
  render() {
    return (
      <div className="badges">
        <a href="//codeship.com/projects/67868" target="_blank"
           data-link-name="Badge - build status">
          <img src="//img.shields.io/codeship/41810250-aa07-0132-fbf4-4e62e8945e03/master.svg"
               alt="build status" />
        </a>
        <a href="//npmjs.org/package/react-autosuggest" target="_blank"
           data-link-name="Badge - npm version">
          <img src="//img.shields.io/npm/v/react-autosuggest.svg"
               alt="npm version" />
        </a>
        <a href="//npmjs.org/package/react-autosuggest" target="_blank"
           data-link-name="Badge - npm downloads">
          <img src="//img.shields.io/npm/dm/react-autosuggest.svg"
               alt="npm downloads" />
        </a>
      </div>
    );
  }
}
