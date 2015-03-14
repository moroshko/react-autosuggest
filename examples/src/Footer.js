'use strict';

var React = require('react');

var Footer = React.createClass({
  render: function() {
    return (
      <div className="footer">
        <img src="//www.gravatar.com/avatar/e56de06f4b56f6f06e4a9a271ed57e26?s=32" />
        <span>
          Crafted with <strong>love</strong> by <a href="//github.com/moroshko" target="_blank">@moroshko</a>
        </span>
      </div>
    );
  }
});

module.exports = Footer;
