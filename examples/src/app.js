'use strict';

require('./Footer/Footer.less');
require('./app.less');

import React from 'react';
import Examples from './Examples';
import Footer from './Footer/Footer';
import ForkMeOnGitHub from './ForkMeOnGitHub/ForkMeOnGitHub';

class App extends React.Component {
  render() {
    return (
      <div>
        <h1>react-autosuggest</h1>
        <Examples />
        <Footer />
        <ForkMeOnGitHub user="moroshko" repo="react-autosuggest" />
      </div>
    );
  }
}

React.render(<App />, document.getElementById('app'));
