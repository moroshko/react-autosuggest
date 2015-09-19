require('./app.less');

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Badges from './Badges/Badges';
import Examples from './Examples';
import Footer from './Footer/Footer';
import ForkMeOnGitHub from './ForkMeOnGitHub/ForkMeOnGitHub';

class App extends Component {
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

ReactDOM.render(<App />, document.getElementById('app'));
