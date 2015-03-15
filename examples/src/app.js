'use strict';

require('./Footer.less');
require('./app.less');

var React = require('react');
var Examples = require('./Examples');
var Footer = require('./Footer');
var ForkMeOnGitHub = require('./ForkMeOnGitHub');

var App = React.createClass({
  render: function() {
    return (
      <div>
        <h1>react-autosuggest</h1>
        <Examples />
        <Footer />
        <ForkMeOnGitHub user="moroshko" repo="react-autosuggest" />
      </div>
    );
  }
});

React.render(<App />, document.getElementById('app'));
