'use strict';

require('./Badges.less');

import React from 'react';

class Badges extends React.Component {
  render() {
    return (
      <div className="badges">
        <a href="//codeship.com/projects/67868" target="_blank">
          <img src="//img.shields.io/codeship/41810250-aa07-0132-fbf4-4e62e8945e03.svg" />
        </a>
        <a href="//npmjs.org/package/react-autosuggest" target="_blank">
          <img src="//img.shields.io/npm/v/react-autosuggest.svg" />
        </a>
        <a href="//npmjs.org/package/react-autosuggest" target="_blank">
          <img src="https://img.shields.io/npm/dm/react-autosuggest.svg" />
        </a>
      </div>
    );
  }
}

export default Badges;
