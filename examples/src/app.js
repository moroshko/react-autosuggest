'use strict';

require('./app.less');

import React, { Component } from 'react';
import Badges from './Badges/Badges';
import Examples from './Examples';
import Footer from './Footer/Footer';
import ForkMeOnGitHub from './ForkMeOnGitHub/ForkMeOnGitHub';

class App extends Component { // eslint-disable-line no-shadow
  render() {
    return (
      <div>
        <h1>react-autosuggest</h1>
        <Badges />
        <Examples />
        <Footer />
        <ForkMeOnGitHub user="moroshko" repo="react-autosuggest" />
      </div>
    );
  }
}

React.render(<App />, document.getElementById('app'));
